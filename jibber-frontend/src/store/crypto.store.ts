import { create } from 'zustand';
import sodium from 'libsodium-wrappers-sumo'
import authStore from '@/store/auth.store'
import type { User } from '@/types'
import Dexie from 'dexie';
import type { EncryptedMessage } from '@/types';
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
  privateIdKey: string | null;
  privateSigningKey: string | null;
  generateRawKeys: () => Promise<{
    privateIdKey: string;
    publicIdKey: string;
    privateSigningKey: string;
    publicSigningKey: string;
  }>;
  rawToBase64: (key: Uint8Array) => string;
  base64toRaw: (key: string) => Uint8Array;
  encryptKey: (
    key: string,
    password: string
  ) => Promise<{
    key: string;
    salt: string;
    nonce: string;
  }>;
  decryptKeys: (
    encPrivateIdKey: string,
    encPrivateSigningKey: string
  ) => Promise<{
    privateIdKey: string;
    privateSigningKey: string;
  }>;
  storeKek: (user: User, password: string) => Promise<void>;
  getValueFromDB: (key: string) => Promise<Uint8Array | undefined>;
  clearSecrets: () => Promise<void>;
  encryptMessage: (
    message: string,
    recipientPublicIdKey: string
  ) => Promise<{
    cipher: string;
    iv: string;
  }>;
  signMessage: (message: string) => Promise<string>;
  decryptMessage: (message: EncryptedMessage) => Promise<string>;
};

const useCryptoStore = create<CryptoStore>((_, get)=>({
  privateIdKey: null,
  privateSigningKey: null,
  generateRawKeys: async () => {
    await sodium.ready;
    const {
      privateKey: privateSigningKeyRaw,
      publicKey: publicSigningKeyRaw,
    } = sodium.crypto_sign_keypair();
    const {
      privateKey: privateIdKeyRaw,
      publicKey: publicIdKeyRaw,
    } = sodium.crypto_box_keypair();
    return {
      privateIdKey: sodium.to_base64(privateIdKeyRaw),
      publicIdKey: sodium.to_base64(publicIdKeyRaw),
      privateSigningKey: sodium.to_base64(privateSigningKeyRaw),
      publicSigningKey: sodium.to_base64(publicSigningKeyRaw),
    };
  },

  rawToBase64(key) {
      return sodium.to_base64(key);
  },

  base64toRaw(key) {
    return sodium.from_base64(key)
  },

 async encryptKey(key, password) {
    await sodium.ready;
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
    const keyBytes = sodium.from_base64(key);
    const encryptedKey = sodium.crypto_secretbox_easy(keyBytes, nonce, kek);

    return {
      key: sodium.to_base64(encryptedKey),
      salt: sodium.to_base64(salt),
      nonce: sodium.to_base64(nonce),
    };
  },

  decryptKeys: async (encPrivateIdKey, encPrivateSigningKey) => {
    await sodium.ready;
    const idKeyKek = await get().getValueFromDB('idKeyKek');
    const idKeyNonce = await get().getValueFromDB('idKeyNonce');
    const signingKeyKek = await get().getValueFromDB('signingKeyKek');
    const signingKeyNonce = await get().getValueFromDB('signingKeyNonce');
    if (!idKeyNonce || !signingKeyNonce || !idKeyKek || !signingKeyKek)
      throw new Error('Problem extracting Key from DB');

    const encPrivateIdKeyBytes = sodium.from_base64(encPrivateIdKey);
    const encPrivateSigningKeyBytes = sodium.from_base64(encPrivateSigningKey);

    const privateIdKeyBytes = sodium.crypto_secretbox_open_easy(
      encPrivateIdKeyBytes,
      idKeyNonce,
      idKeyKek,
    );
    if (!privateIdKeyBytes)
      throw new Error('Failed to decrypt Private ID Key');

    const privateSigningKeyBytes = sodium.crypto_secretbox_open_easy(
      encPrivateSigningKeyBytes,
      signingKeyNonce,
      signingKeyKek,
    );
    if (!privateSigningKeyBytes)
      throw new Error('Failed to decrypt Private Signing Key');

    return {
      privateIdKey: sodium.to_base64(privateIdKeyBytes),
      privateSigningKey: sodium.to_base64(privateSigningKeyBytes),
    };
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

  async encryptMessage(message, recipientPublicIdKey) {
    await sodium.ready;
    const { privateIdKey, rawToBase64 } = get();
    if (!privateIdKey) {
      console.error('No private id key found');
      throw new Error('No Private Id Key found');
    }
    const privateIdKeyBytes = sodium.from_base64(privateIdKey);
    const recipientPublicIdKeyBytes = sodium.from_base64(recipientPublicIdKey);

    const sharedSecret = sodium.crypto_scalarmult(
      privateIdKeyBytes,
      recipientPublicIdKeyBytes,
    );
    const sharedSecretBytes = new Uint8Array(sharedSecret);

    const aesKeyMaterial = sodium.crypto_generichash(32, sharedSecretBytes);
    const aesKeyBytes = new Uint8Array(aesKeyMaterial);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      aesKeyBytes,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt'],
    );

    const encoder = new TextEncoder();
    const plainText = encoder.encode(message);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      cryptoKey,
      plainText,
    );
    const cipherUint8 = new Uint8Array(ciphertext);
    const cipher = rawToBase64(cipherUint8);
    const ivString = rawToBase64(iv);
    return {
      cipher,
      iv: ivString,
    };
  },

  async signMessage(message) {
    await sodium.ready;
    const { privateSigningKey, rawToBase64 } = get();
    if (!privateSigningKey) throw new Error('Private signing key not present');
    const privateSigningKeyBytes = sodium.from_base64(privateSigningKey);
    const messageBytes = sodium.from_string(message);
    const signature = sodium.crypto_sign_detached(
      messageBytes,
      privateSigningKeyBytes,
    );
    return rawToBase64(new Uint8Array(signature));
  },

  async generateSecret(publicIdKey: string): Promise<string> {
    await sodium.ready;
    const { privateIdKey, rawToBase64 } = get();
    if (!privateIdKey) throw new Error('Private Id Key not found');

    const privateIdKeyBytes = sodium.from_base64(privateIdKey);
    const recipientPublicIdKeyBytes = sodium.from_base64(publicIdKey);
    const sharedSecret = sodium.crypto_scalarmult(
      privateIdKeyBytes,
      recipientPublicIdKeyBytes,
    );

    if (!sharedSecret) throw new Error('Error generating shared secret');
    return rawToBase64(new Uint8Array(sharedSecret));
  },

  async decryptMessage(message) {
    const { cipher, senderPublicIdKey, iv, sender, receiverPublicIdKey } =
      message;
    const { privateIdKey } = get();
    const { user } = authStore.getState();
    if (!privateIdKey) throw new Error('No Private Id key found');

    await sodium.ready;

    const privateIdKeyBytes = sodium.from_base64(privateIdKey);
    const messageBytes = sodium.from_base64(cipher);
    const ivBytes = sodium.from_base64(iv);
    const senderPublicIdKeyBytes = sodium.from_base64(senderPublicIdKey);
    const receiverPublicIdKeyBytes = sodium.from_base64(receiverPublicIdKey);

    const privateKeyBytes = new Uint8Array(privateIdKeyBytes);
    const senderKeyBytes = new Uint8Array(senderPublicIdKeyBytes);
    const receiverKeyBytes = new Uint8Array(receiverPublicIdKeyBytes);

    let sharedSecret: Uint8Array;
    if (sender === user?._id) {
      sharedSecret = sodium.crypto_scalarmult(privateKeyBytes, receiverKeyBytes);
    } else {
      sharedSecret = sodium.crypto_scalarmult(privateKeyBytes, senderKeyBytes);
    }

    if (!sharedSecret) throw new Error('Failed to derive shared secret');

    const sharedSecretBytes = new Uint8Array(sharedSecret);
    const aesKeyMaterial = sodium.crypto_generichash(32, sharedSecretBytes);
    const aesKeyBytes = new Uint8Array(aesKeyMaterial);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      aesKeyBytes,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt'],
    );

    const ivBuffer = new Uint8Array(ivBytes);
    const messageBuffer = new Uint8Array(messageBytes);

    const decryptedMessageArrayBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      cryptoKey,
      messageBuffer,
    );
    const decryptedMessageUint8 = new Uint8Array(decryptedMessageArrayBuffer);
    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(decryptedMessageUint8);

    return decryptedMessage;
  },
  

})) 

export default useCryptoStore;
