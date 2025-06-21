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
  storeKek: (user: User, password: string) => Promise<void>
  getValuefromDB: (key: string) => Promise<Uint8Array | undefined>
  clearSecrets: () => Promise<void>
};

const useCryptoStore = create<CryptoStore>(()=>({
  privateIdKey: null,
  privateSigningKey: null,
  generateRawKeys: async () => {
    await sodium.ready
    const {privateKey: privateSigningKey, publicKey: publicSigningKey} = sodium.crypto_sign_keypair();
    const privateIdKey = sodium.crypto_sign_ed25519_sk_to_curve25519(privateSigningKey);
    const publicIdKey = sodium.crypto_sign_ed25519_pk_to_curve25519(publicSigningKey);
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

  async storeKek(user: User, password) {
      const base64toRaw = useCryptoStore.getState().base64toRaw;
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

  async getValuefromDB(key: string){
    const value =  await db.userSecrets.get(key);
    return value?.value;  
  },

  clearSecrets: async () => {
    await db.userSecrets.clear();
  }



})) 

export default useCryptoStore;
