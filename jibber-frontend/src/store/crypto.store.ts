import { create } from 'zustand';
import type { User } from '@/types';
import {
  decryptKeysService,
  clearDbService,
} from '@/services/crypto.service'; // Import the new service

interface CryptoState {
  privateIdKey: string | null;
  privateSigningKey: string | null;
  decryptAndStoreKeys: (user: User) => Promise<void>;
  clearKeys: () => Promise<void>;
}

const useCryptoStore = create<CryptoState>((set) => ({
  privateIdKey: null,
  privateSigningKey: null,

  /**
   * Decrypts the user's private keys using the service and stores them in state.
   */
  decryptAndStoreKeys: async (user: User) => {
    try {
      const { privateIdKey, privateSigningKey } = await decryptKeysService(
        user.encPrivateIdKey,
        user.encPrivateSigningKey
      );
      set({ privateIdKey, privateSigningKey });
    } catch (error) {
      console.error("Failed to decrypt and store keys:", error);
    }
  },

  /**
   * Clears private keys from the state and the underlying database.
   */
  clearKeys: async () => {
    await clearDbService();
    set({ privateIdKey: null, privateSigningKey: null });
  },
}));

export default useCryptoStore;

