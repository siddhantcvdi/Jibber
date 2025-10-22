import sodium from 'libsodium-wrappers-sumo';
import Dexie from 'dexie';
import useCryptoStore from '../store/crypto.store';
import authStore from '../store/auth.store';
import type {User} from '@/types'
import type { EncryptedMessage } from '@/types';

// --- DATABASE SETUP ---

interface UserSecret {
  key: string;
  value: Uint8Array;
}

class CryptoDB extends Dexie {
  userSecrets!: Dexie.Table<UserSecret, string>;

  constructor() {
    super('CryptoStore');
    this.version(1).stores({
      userSecrets: 'key',
    });
  }
}

const db = new CryptoDB();

// --- SODIUM INITIALIZATION ---

// Ensures that sodium.ready is only awaited once.
let sodiumReadyPromise: Promise<void> | null = null;
const initializeSodium = (): Promise<void> => {
  if (!sodiumReadyPromise) {
    sodiumReadyPromise = sodium.ready;
  }
  return sodiumReadyPromise;
};

// --- HELPER FUNCTIONS ---

const base64toRaw = (key: string): Uint8Array => sodium.from_base64(key);
const rawToBase64 = (key: Uint8Array): string => sodium.to_base64(key);

const _deriveAesKey = async (
  ownPrivateIdKey: string,
  otherPartyPublicIdKey: string
): Promise<CryptoKey> => {
  await initializeSodium();

  const privateKeyBytes = base64toRaw(ownPrivateIdKey);
  const publicKeyBytes = base64toRaw(otherPartyPublicIdKey);

  const sharedSecret = sodium.crypto_scalarmult(privateKeyBytes, publicKeyBytes);
  const aesKeyMaterial = sodium.crypto_generichash(32, new Uint8Array(sharedSecret));

  return crypto.subtle.importKey(
    'raw',
    new Uint8Array(aesKeyMaterial),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
};

// --- EXPORTED SERVICE FUNCTIONS ---

export const generateRawKeysService = async (): Promise<{
  privateIdKey: string;
  publicIdKey: string;
  privateSigningKey: string;
  publicSigningKey: string;
}> => {
  await initializeSodium();

  const { privateKey: privateSigningKeyRaw, publicKey: publicSigningKeyRaw } =
    sodium.crypto_sign_keypair();
  const { privateKey: privateIdKeyRaw, publicKey: publicIdKeyRaw } =
    sodium.crypto_box_keypair();

  return {
    privateIdKey: rawToBase64(privateIdKeyRaw),
    publicIdKey: rawToBase64(publicIdKeyRaw),
    privateSigningKey: rawToBase64(privateSigningKeyRaw),
    publicSigningKey: rawToBase64(publicSigningKeyRaw),
  };
};

export const encryptKeyService = async (
  key: string,
  password: string
): Promise<{ key: string; salt: string; nonce: string }> => {
  await initializeSodium();

  const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
  const kek = sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const keyBytes = base64toRaw(key);
  const encryptedKey = sodium.crypto_secretbox_easy(keyBytes, nonce, kek);

  return {
    key: rawToBase64(encryptedKey),
    salt: rawToBase64(salt),
    nonce: rawToBase64(nonce),
  };
};

  export const decryptKeysService = async (
  encPrivateIdKey: string,
  encPrivateSigningKey: string
): Promise<{ privateIdKey: string; privateSigningKey: string }> => {
  await initializeSodium();

  const secrets = await db.userSecrets.bulkGet([
    'idKeyKek',
    'idKeyNonce',
    'signingKeyKek',
    'signingKeyNonce',
  ]);

  const idKeyKek = secrets[0]?.value;
  const idKeyNonce = secrets[1]?.value;
  const signingKeyKek = secrets[2]?.value;
  const signingKeyNonce = secrets[3]?.value;

  if (!idKeyKek || !idKeyNonce || !signingKeyKek || !signingKeyNonce) {
    throw new Error('Problem extracting Key from DB');
  }

  const privateIdKeyBytes = sodium.crypto_secretbox_open_easy(
    base64toRaw(encPrivateIdKey),
    idKeyNonce,
    idKeyKek
  );
  if (!privateIdKeyBytes) throw new Error('Failed to decrypt Private ID Key');

  const privateSigningKeyBytes = sodium.crypto_secretbox_open_easy(
    base64toRaw(encPrivateSigningKey),
    signingKeyNonce,
    signingKeyKek
  );
  if (!privateSigningKeyBytes)
    throw new Error('Failed to decrypt Private Signing Key');

  return {
    privateIdKey: rawToBase64(privateIdKeyBytes),
    privateSigningKey: rawToBase64(privateSigningKeyBytes),
  };
};

export const signMessageService = async (
  message: string,
  privateSigningKey: string
): Promise<string> => {
  await initializeSodium();

  const messageBytes = sodium.from_string(message);
  const privateSigningKeyBytes = base64toRaw(privateSigningKey);
  const signature = sodium.crypto_sign_detached(messageBytes, privateSigningKeyBytes);
  return rawToBase64(signature);
};

export const storeKekService = async (
  user: User,
  password: string
): Promise<void> => {
  await initializeSodium();

  const { idKeySalt, signingKeySalt, idKeyNonce, signingKeyNonce } = user;

  const idKeyKek = sodium.crypto_pwhash(
    32,
    password,
    base64toRaw(idKeySalt),
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  const signingKeyKek = sodium.crypto_pwhash(
    32,
    password,
    base64toRaw(signingKeySalt),
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  await db.userSecrets.bulkPut([
    { key: 'idKeyKek', value: idKeyKek },
    { key: 'signingKeyKek', value: signingKeyKek },
    { key: 'idKeyNonce', value: base64toRaw(idKeyNonce) },
    { key: 'signingKeyNonce', value: base64toRaw(signingKeyNonce) },
  ]);
};

export const encryptMessageService = async (
  message: string,
  privateIdKey: string,
  recipientPublicIdKey: string
): Promise<{ cipher: string; iv: string }> => {
  await initializeSodium();

  const privateIdKeyBytes = base64toRaw(privateIdKey);
  const recipientPublicIdKeyBytes = base64toRaw(recipientPublicIdKey);

  const sharedSecret = sodium.crypto_scalarmult(privateIdKeyBytes, recipientPublicIdKeyBytes);
  const aesKeyMaterial = sodium.crypto_generichash(32, sharedSecret);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    aesKeyMaterial,
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedMessage = new TextEncoder().encode(message);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encodedMessage
  );

  return {
    cipher: rawToBase64(new Uint8Array(ciphertext)),
    iv: rawToBase64(iv),
  };
};


export const decryptMessageService = async (message: EncryptedMessage) => {
  const { privateIdKey } = useCryptoStore.getState();
  const user = authStore.getState().user;
  if (!privateIdKey || !user) throw new Error('Cannot decrypt message: user or private key is missing.');

  const otherPartyPublicIdKey = (message.sender === user._id)
    ? message.receiverPublicIdKey
    : message.senderPublicIdKey;

  const cryptoKey = await _deriveAesKey(privateIdKey, otherPartyPublicIdKey);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64toRaw(message.iv) },
    cryptoKey,
    base64toRaw(message.cipher)
  );

  return new TextDecoder().decode(new Uint8Array(decryptedBuffer));
};

export const clearDbService = async (): Promise<void> => {
  await db.userSecrets.clear();
};
