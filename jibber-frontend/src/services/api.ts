import axios, { AxiosError } from "axios";
import type {AxiosRequestConfig} from "axios";
import authStore from "@/store/auth.store.ts";

interface QueueItem {
    resolve: (accessToken: string) => void;
    reject: (error: unknown) => void;
}

interface AxiosRequestWithRetry extends AxiosRequestConfig {
    _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const refreshApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else if (token) {
            resolve(token);
        }
    });
    failedQueue = [];
};

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

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestWithRetry;

        const status = error.response?.status;
        const isRefreshUrl = originalRequest.url?.includes('/auth/refresh');

        if (status === 401 && !originalRequest._retry && !isRefreshUrl) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await refreshApi.post("/auth/refresh", {});
                const { accessToken } = refreshResponse.data.data;

                const { user } = authStore.getState();
                authStore.getState().setAuth(accessToken, user);

                processQueue(null, accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                authStore.getState().clearAuth();

                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },

);

export default api;
