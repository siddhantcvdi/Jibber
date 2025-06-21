import { create } from 'zustand';
import api, { refreshApi } from '@/services/api.ts';
import * as opaque from '@serenity-kit/opaque';
import useCryptoStore from './crypto.store';

interface RegisterData {
  username: string;
  password: string;
  email: string;
}

interface LoginData {
  usernameOrEmail: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  encPrivateIdKey: string,
  encPrivateSigningKey: string,
  publicIdKey: string,
  publicSigningKey: string,
  idKeyNonce: string,
  signingKeyNonce: string,
  idKeySalt: string,
  signingKeySalt: string
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  registerUser: (userData: RegisterData) => Promise<void>;
  loginUser: (userData: LoginData) => Promise<void>;
  setAuth: (accessToken: string, user: User | null) => void;
  clearAuth: () => void;
  setLoading: (isAuthLoading: boolean) => void;
  getAccessToken: () => string | null;
  silentRefresh: () => Promise<{ success: boolean }>;
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAuthLoading: false,
  setAuth: (accessToken, user) => {
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isAuthLoading: false,
    });
  },
  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isAuthLoading: false,
    });
  },
  setLoading: (isAuthLoading) => {
    set({ isAuthLoading });
  },

  getAccessToken: () => get().accessToken,

  registerUser: async (userData) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    set({ isAuthLoading: true });
    try {
      const password = userData.password;
      const { registrationRequest, clientRegistrationState } =
        opaque.client.startRegistration({ password });

      const { data: startData } = await api.post(
        `${backendURL}/auth/register-start`,
        {
          username: userData.username,
          email: userData.email,
          registrationRequest,
        }
      );

      const registrationResponse = startData.data;
      console.log('Registration started ✅');
      const { registrationRecord } = opaque.client.finishRegistration({
        clientRegistrationState,
        registrationResponse,
        password,
      });

      const generateRawKeys = useCryptoStore.getState().generateRawKeys;
      const rawToBase64 = useCryptoStore.getState().rawToBase64;
      const encryptKey = useCryptoStore.getState().encryptKey;
      const { privateIdKey, privateSigningKey, publicIdKey, publicSigningKey } = await generateRawKeys();
      // console.log(privateIdKey.length, password, privateSigningKey);
      
      const encPrivateIdKey = await encryptKey(privateIdKey, password);
      const encPrivateSigningKey = await encryptKey(privateSigningKey, password);

      const { data: finishData } = await api.post(
        `${backendURL}/auth/register-finish`,
        {
          username: userData.username,
          email: userData.email,
          registrationRecord,
          encPrivateIdKey: rawToBase64(encPrivateIdKey.key),
          publicIdKey: rawToBase64(publicIdKey),
          idKeyNonce: rawToBase64(encPrivateIdKey.nonce),
          idKeySalt: rawToBase64(encPrivateIdKey.salt),
          encPrivateSigningKey: rawToBase64(encPrivateSigningKey.key),
          publicSigningKey: rawToBase64(publicSigningKey),
          signingKeyNonce: rawToBase64(encPrivateIdKey.nonce),
          signingKeySalt: rawToBase64(encPrivateIdKey.salt),
        }
      );
      console.log('Registration finished ✅', finishData.data);
    } catch (err: unknown) {
      console.error('Registration error ❌', err);
      throw err;
    } finally {
      set({ isAuthLoading: false });
    }
  },
  loginUser: async (userData: LoginData) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    set({ isAuthLoading: true });
    try {
      const password = userData.password;
      let clientLoginState, startLoginRequest;
      try {
        const loginStartResult = opaque.client.startLogin({ password });
        clientLoginState = loginStartResult.clientLoginState;
        startLoginRequest = loginStartResult.startLoginRequest;
        console.log('OPAQUE client startLogin successful');
      } catch (opaqueError) {
        console.error('OPAQUE client startLogin failed:', opaqueError);
        throw new Error('Failed to start login process');
      }

      const { data: startData } = await api.post(
        `${backendURL}/auth/login-start`,
        {
          usernameOrEmail: userData.usernameOrEmail,
          startLoginRequest,
        }
      );

      const loginResponse = startData.data;
      console.log('Login start response:', loginResponse);

      let loginResult;
      try {
        loginResult = opaque.client.finishLogin({
          clientLoginState,
          loginResponse,
          password,
        });
        console.log('OPAQUE client finishLogin successful:', loginResult);
      } catch (opaqueError) {
        console.error('OPAQUE client finishLogin failed:', opaqueError);
        throw new Error('Invalid credentials or login process failed');
      }

      if (!loginResult || !loginResult.finishLoginRequest) {
        throw new Error(
          'Login Failed - Invalid credentials or missing finishLoginRequest'
        );
      }

      const { finishLoginRequest } = loginResult;

      const { data: finishData } = await api.post(
        `${backendURL}/auth/login-finish`,
        {
          usernameOrEmail: userData.usernameOrEmail,
          finishLoginRequest,
        }
      );

      const { user, accessToken } = finishData.data;
      console.log('Login successful, user:', user);
      const base64toRaw = useCryptoStore.getState().base64toRaw;
      useCryptoStore.setState({privateIdKey: base64toRaw(user.encPrivateIdKey), privateSigningKey: base64toRaw(user.encPrivateSigningKey)});
      
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isAuthLoading: false,
      });

      const storeKek = useCryptoStore.getState().storeKek;
      await storeKek(user, password);
      

    } catch (err: unknown) {
      console.error('Login error ❌', err);
      set({ isAuthLoading: false });
      throw err;
    }
  },
  silentRefresh: async () => {
    const { isAuthenticated, setLoading, setAuth, clearAuth } = get();

    if (!isAuthenticated) {
      setLoading(true);
    }

    try {
      const response = await refreshApi.post('/auth/refresh');
      console.log(response);

      const { accessToken } = response.data.data;

      try {
        const userResponse = await api.get('/auth/me');
        const user = userResponse.data.data.user;
        setAuth(accessToken, user);
        const base64toRaw = useCryptoStore.getState().base64toRaw;
        useCryptoStore.setState({privateIdKey: base64toRaw(user.encPrivateIdKey), privateSigningKey: base64toRaw(user.encPrivateSigningKey)});
      } catch {
        setAuth(accessToken, null);
      }
      return { success: true };
    } catch {
      setLoading(false);
      if (isAuthenticated) {
        clearAuth();
      }
      return { success: false };
    }
  },
}));

export default authStore;
