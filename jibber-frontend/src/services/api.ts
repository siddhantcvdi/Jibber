import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import authStore from '@/store/auth.store.ts';

// A custom error class to signal that token refresh failed and the user should be logged out.
export class AuthRefreshError extends Error {
  constructor(message?: string) {
    super(message || 'Session expired. Please log in again.');
    this.name = 'AuthRefreshError';
  }
}

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

// Extend AxiosRequestConfig to include our custom _retry flag.
interface AxiosRequestWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// A separate Axios instance for token refresh to avoid circular interceptor calls.
export const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// --- Global state for handling token refresh ---
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      // The promise `resolve` will be called with the original request config,
      // which will then be retried by the calling function.
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: Attach the Authorization header to outgoing requests.
api.interceptors.request.use(
  (config) => {
    const accessToken = authStore.getState().getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle expired tokens and queue subsequent requests.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestWithRetry;

    // Check for 401 Unauthorized, ensure it's not a retry, and not the refresh endpoint itself.
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest); // Retry the original request with the new token.
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshApi.post('/auth/refresh');
        const accessToken  = refreshResponse.data.data;
        console.log(accessToken);

        // Update the token in the auth store.
        authStore.getState().setAccessToken(accessToken);

        // Process the queue with the new token.
        processQueue(null, accessToken);

        // Retry the original request that failed.
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh fails, reject all queued requests and the current one.
        processQueue(refreshError);
        authStore.getState().clearAuth();

        // IMPORTANT: Instead of redirecting, we reject with a custom error.
        // The UI layer can catch this specific error and decide to redirect the user.
        return Promise.reject(new AuthRefreshError());
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
