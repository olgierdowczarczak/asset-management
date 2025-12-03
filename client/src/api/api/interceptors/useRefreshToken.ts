import type { AxiosInstance } from 'axios';
import config from '@/config';
import { AuthService } from '@/services';
import { StorageConstants } from '@/constants';

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

function useRefreshToken(api: AxiosInstance) {
    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config;
            const isAuthEndpoint =
                originalRequest.url?.endsWith('/auth/me') ||
                originalRequest.url?.endsWith('/auth/refresh') ||
                originalRequest.url?.endsWith('/auth/login');

            if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api.request(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const newToken = await AuthService.refresh();
                    localStorage.setItem(StorageConstants.accessToken, newToken);
                    api.defaults.headers.Authorization = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    isRefreshing = false;
                    return api.request(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    isRefreshing = false;
                    localStorage.removeItem(StorageConstants.accessToken);
                    window.location.href = config.routes.login;
                    return Promise.reject(err);
                }
            }
            return Promise.reject(error);
        },
    );
}

export default useRefreshToken;
