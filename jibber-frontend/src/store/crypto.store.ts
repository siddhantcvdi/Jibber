import { create } from 'zustand';
import sodium from 'libsodium-wrappers'

type CryptoStore = {
  generateRawKeys: () => Promise<{
    privateIdKey: Uint8Array<ArrayBufferLike>,
    publicIdKey: Uint8Array<ArrayBufferLike>,
    privateSigningKey: Uint8Array<ArrayBufferLike>,
    publicSigningKey: Uint8Array<ArrayBufferLike>
  }>,
  rawToBase64: (key: Uint8Array<ArrayBufferLike>) => string,
  base64toRaw: (key: string)  => Uint8Array<ArrayBufferLike>
  // encryptPrivateKey: (key: string) => Uint8Array<ArrayBufferLike>
};

const useCryptoStore = create<CryptoStore>(()=>({
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

  // encryptPrivateKey(key, password){

  // }

  
}))

export default useCryptoStore;
