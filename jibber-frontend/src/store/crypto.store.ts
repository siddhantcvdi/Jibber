import { create } from 'zustand';
import sodium from 'libsodium-wrappers-sumo'
import type {User} from '@/store/auth.store'
import Dexie from 'dexie';

interface UserSecret {
  key: string;
  value: Uint8Array;
}

class CryptoDB extends Dexie {
  userSecrets!: Dexie.Table<UserSecret, string>;

  constructor() {
    super('CryptoStore');
    this.version(1).stores({
      userSecrets: 'key' 
    });
  }
}

const db = new CryptoDB();


type CryptoStore = {
  privateIdKey: Uint8Array | null,
  privateSigningKey: Uint8Array | null,
  generateRawKeys: () => Promise<{
    privateIdKey: Uint8Array,
    publicIdKey: Uint8Array,
    privateSigningKey: Uint8Array,
    publicSigningKey: Uint8Array
  }>,
  rawToBase64: (key: Uint8Array) => string,
  base64toRaw: (key: string)  => Uint8Array
  encryptKey: (key: Uint8Array, password: string) =>  Promise<{
    key: Uint8Array,
    salt: Uint8Array,
    nonce: Uint8Array
  }>,
  decryptKeys: (encPrivateIdKey: Uint8Array, encPrivateSigningKey: Uint8Array) => Promise<{
    privateIdKey: Uint8Array,
    privateSigningKey: Uint8Array
  }>,
  storeKek: (user: User, password: string) => Promise<void>
  getValueFromDB: (key: string) => Promise<Uint8Array | undefined>
  clearSecrets: () => Promise<void>,
  encryptMessage: (message: string, recipientPublicIdKey: Uint8Array) => Promise<Uint8Array>,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
};

const useCryptoStore = create<CryptoStore>((_, get)=>({
  privateIdKey: null,
  privateSigningKey: null,
  generateRawKeys: async () => {
    await sodium.ready
    const {privateKey: privateSigningKey, publicKey: publicSigningKey} = sodium.crypto_sign_keypair();
    const { privateKey: privateIdKey, publicKey: publicIdKey } = sodium.crypto_box_keypair();
    return {
      privateIdKey,
      publicIdKey,
      privateSigningKey,
      publicSigningKey
    }
  },

  rawToBase64(key) {
      return sodium.to_base64(key);
  },

  base64toRaw(key) {
    return sodium.from_base64(key)
  },

 async encryptKey(key, password){
    await sodium.ready
    console.log(sodium.crypto_pwhash_SALTBYTES);
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    const kek = sodium.crypto_pwhash(
      32,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_DEFAULT,
    );

    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const encryptedKey = sodium.crypto_secretbox_easy(key, nonce, kek);

    return {
      key: encryptedKey,
      salt,
      nonce
    }
  },

  decryptKeys: async (encPrivateIdKey, encPrivateSigningKey) => {
    await sodium.ready;
    const idKeyKek = await get().getValueFromDB('idKeyKek');
    const idKeyNonce = await get().getValueFromDB('idKeyNonce');
    const signingKeyKek = await get().getValueFromDB('signingKeyKek');
    const signingKeyNonce = await get().getValueFromDB('signingKeyNonce');
    if(!idKeyNonce || !signingKeyNonce || !idKeyKek || !signingKeyKek) throw new Error('Problem extracting Key from DB');
    const privateIdKey = sodium.crypto_secretbox_open_easy(encPrivateIdKey, idKeyNonce, idKeyKek);
    if (!privateIdKey) throw new Error('Failed to decrypt Private ID Key');
    const privateSigningKey = sodium.crypto_secretbox_open_easy(encPrivateSigningKey, signingKeyNonce, signingKeyKek);
    if (!privateSigningKey) throw new Error('Failed to decrypt Private Signing Key');
    return {
      privateIdKey,
      privateSigningKey
    }
  },

  async storeKek(user: User, password) {
      const base64toRaw = get().base64toRaw;
      const {idKeySalt, signingKeySalt, idKeyNonce, signingKeyNonce} = user;
      const idKeyKek = sodium.crypto_pwhash(
        32,
        password,
        base64toRaw(idKeySalt),
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_ALG_DEFAULT,
      ); 
      const signingKeyKek = sodium.crypto_pwhash(
        32,
        password,
        base64toRaw(signingKeySalt),
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_ALG_DEFAULT,
      );
      await db.userSecrets.put({ key: 'idKeyKek', value: idKeyKek })
      await db.userSecrets.put({ key: 'signingKeyKek', value: signingKeyKek })
      await db.userSecrets.put({ key: 'idKeyNonce', value: base64toRaw(idKeyNonce) })
      await db.userSecrets.put({ key: 'signingKeyNonce', value: base64toRaw(signingKeyNonce) })
  },

  async getValueFromDB(key: string){
    const value =  await db.userSecrets.get(key);
    return value?.value;  
  },

  clearSecrets: async () => {
    await db.userSecrets.clear();
  },

  async encryptMessage(message, recipientPublicIdKey){
    await sodium.ready;
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const {privateIdKey} = get()
    if(!privateIdKey) throw new Error("Private id Key not found");
    const cipher = sodium.crypto_box_easy(
      message,
      nonce,
      recipientPublicIdKey,
      privateIdKey
    );
    return cipher;
  },

  async signMessage(message){
    await sodium.ready;
    const {privateSigningKey} = get();
    if(!privateSigningKey) throw new Error("Private signing key not present");
    return sodium.crypto_sign_detached(message, privateSigningKey );
  }

})) 

export default useCryptoStore;
