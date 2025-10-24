import { create } from 'zustand';
import api, { refreshApi } from '@/services/api.ts';
import useCryptoStore from './crypto.store';
import { useSocketStore } from './socket.store';
import type {User, RegisterData, LoginData} from '@/types';
import {
  loginUserService,
  registerUserService,
  getErrorMessage
} from '../services/auth.service.ts';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  error: string | null;
  registerUser: (userData: RegisterData) => Promise<boolean>;
  loginUser: (userData: LoginData) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  setAuth: (accessToken: string | null, user: User | null) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (isAuthLoading: boolean) => void;
  getAccessToken: () => string | null;
  silentRefresh: () => Promise<{ success: boolean }>;
  clearError: () => void;
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAuthLoading: false,
  error: null,
  setAuth: (accessToken, user) => {
    set({
      accessToken,
      user,
      isAuthenticated: !!(accessToken && user),
      isAuthLoading: false,
      error: null,
    });
  },
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isAuthLoading: false,
      error: null,
    });
  },
  clearError: () => {
    set({ error: null });
  },
  setLoading: (isAuthLoading) => {
    set({ isAuthLoading });
  },
  getAccessToken: () => get().accessToken,

  registerUser: async (userData) => {
    set({ isAuthLoading: true, error: null });
    try {
      await registerUserService(userData);
      set({ isAuthLoading: false });
      return true;
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      console.error('Registration error ❌', message);
      set({ isAuthLoading: false, error: message });
      return false;
    }
  },

  loginUser: async (userData: LoginData) => {
    set({ isAuthLoading: true, error: null });
    try {
      const { user, accessToken } = await loginUserService(userData); // Call the service
      get().setAuth(accessToken, user); // Update state with the result
      return true;
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      console.error('Login error ❌', message);
      get().clearAuth();
      set({ error: message, isAuthLoading: false });
      return false;
    }
  },

  logoutUser: async () => {
    set({ isAuthLoading: true });
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed on server, clearing client session anyway.", error);
    } finally {
      get().clearAuth();
      useCryptoStore.getState().clearKeys();
    }
  },

  silentRefresh: async () => {
    const { isAuthenticated, setLoading, setAuth, clearAuth } = get();
    if (!isAuthenticated) setLoading(true);

    try {
      const response = await refreshApi.post('/auth/refresh');
      const { accessToken } = response.data.data;
      const userResponse = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = userResponse.data.data.user;
      setAuth(accessToken, user);

      await useCryptoStore.getState().decryptAndStoreKeys(user);

      return { success: true };
    } catch (error) {
      console.error("Silent refresh failed", error);
      clearAuth();
      return { success: false };
    } finally {
      if (!get().isAuthenticated) {
        setLoading(false);
      }
    }
  },
}));

// The subscription model.
authStore.subscribe(
  (state, prevState) => {
    if (state.isAuthenticated && !prevState.isAuthenticated) {
      useSocketStore.getState().connectSocket();
    }
    if (!state.isAuthenticated && prevState.isAuthenticated) {
      useSocketStore.getState().disconnectSocket();
    }
  }
);

export default authStore;

