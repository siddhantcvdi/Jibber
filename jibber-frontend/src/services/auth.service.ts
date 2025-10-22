import api from '@/services/api.ts';
import * as opaque from '@serenity-kit/opaque';
import { AxiosError } from 'axios';
import useCryptoStore from '../store/crypto.store';
import type { RegisterData, LoginData, User } from '@/types';

// Helper to extract a user-friendly error message from an Axios error.
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
};

export const registerUserService = async (userData: RegisterData): Promise<void> => {
  const { password } = userData;
  const { registrationRequest, clientRegistrationState } =
    opaque.client.startRegistration({ password });

  const { data: startData } = await api.post('/auth/register-start', {
    username: userData.username,
    email: userData.email,
    registrationRequest,
  });

  const registrationResponse = startData.data;
  const { registrationRecord } = opaque.client.finishRegistration({
    clientRegistrationState,
    registrationResponse,
    password,
  });

  const { generateRawKeys, encryptKey } = useCryptoStore.getState();
  const { privateIdKey, privateSigningKey, publicIdKey, publicSigningKey } = await generateRawKeys();

  const encPrivateIdKey = await encryptKey(privateIdKey, password);
  const encPrivateSigningKey = await encryptKey(privateSigningKey, password);

  await api.post('/auth/register-finish', {
    username: userData.username,
    email: userData.email,
    registrationRecord,
    encPrivateIdKey: encPrivateIdKey.key,
    publicIdKey,
    idKeyNonce: encPrivateIdKey.nonce,
    idKeySalt: encPrivateIdKey.salt,
    encPrivateSigningKey: encPrivateSigningKey.key,
    publicSigningKey,
    signingKeyNonce: encPrivateSigningKey.nonce,
    signingKeySalt: encPrivateSigningKey.salt,
  });
};

/**
 * @returns An object containing the user and accessToken.
 */

export const loginUserService = async (userData: LoginData): Promise<{ user: User; accessToken: string }> => {
  const { password } = userData;
  const { clientLoginState, startLoginRequest } = opaque.client.startLogin({ password });

  const { data: startData } = await api.post('/auth/login-start', {
    usernameOrEmail: userData.usernameOrEmail,
    startLoginRequest,
  });

  const loginResponse = startData.data;
  const loginResult = opaque.client.finishLogin({
    clientLoginState,
    loginResponse,
    password,
  });

  if(!loginResult){
    throw new Error('Finish login failed, loginResult is undefined.');
  }

  const { finishLoginRequest } = loginResult;

  if (!finishLoginRequest) {
    throw new Error('Login Failed - Invalid credentials (finishLoginRequest is undefined).');
  }

  const { data: finishData } = await api.post('/auth/login-finish', {
    usernameOrEmail: userData.usernameOrEmail,
    finishLoginRequest,
  });

  const { user, accessToken } = finishData.data;

  // Decouple crypto and socket logic from the core login flow,
  // but keep it within the service layer.
  await useCryptoStore.getState().storeKek(user, password);
  await useCryptoStore.getState().decryptAndStoreKe ys(user);

  return { user, accessToken };
};
