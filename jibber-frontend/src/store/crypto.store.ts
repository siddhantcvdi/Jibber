import { create } from 'zustand';
import sodium from 'libsodium-wrappers';

type CryptoStore = {
  generateRawKeys: () => Promise<{
    privateIdKey: Uint8Array<ArrayBufferLike>;
    publicIdKey: Uint8Array<ArrayBufferLike>;
    privateSigningKey: Uint8Array<ArrayBufferLike>;
    publicSigningKey: Uint8Array<ArrayBufferLike>;
  }>;
  rawToBase64: (key: Uint8Array<ArrayBufferLike>) => string;
  base64toRaw: (key: string) => Uint8Array<ArrayBufferLike>;
  encryptPrivateKey: (
    key: Uint8Array<ArrayBufferLike>,
    password: string
  ) => Promise<{
    key: Uint8Array<ArrayBufferLike>;
    salt: Uint8Array<ArrayBufferLike>;
    nonce: Uint8Array<ArrayBufferLike>;
  }>;
};

const useCryptoStore = create<CryptoStore>(() => ({
  generateRawKeys: async () => {
    await sodium.ready;
    const { privateKey: privateSigningKey, publicKey: publicSigningKey } =
      sodium.crypto_sign_keypair();
    const privateIdKey =
      sodium.crypto_sign_ed25519_sk_to_curve25519(privateSigningKey);
    const publicIdKey =
      sodium.crypto_sign_ed25519_pk_to_curve25519(publicSigningKey);
    return {
      privateIdKey,
      publicIdKey,
      privateSigningKey,
      publicSigningKey,
    };
  },

  rawToBase64(key) {
    return sodium.to_base64(key);
  },

  base64toRaw(key) {
    return sodium.from_base64(key);
  },

  async encryptPrivateKey(key, password) {
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
    const encryptedKey = sodium.crypto_secretbox_easy(key, nonce, kek);

    return {
      key: encryptedKey,
      salt,
      nonce,
    };
  },
}));

export default useCryptoStore;
