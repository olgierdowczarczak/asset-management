import type { AxiosInstance } from 'axios';
import config from '@/config';
import { AuthService } from '@/services';

let isRefreshing = false;

function useRefreshToken(api: AxiosInstance) {
    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config;
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !isRefreshing &&
                !originalRequest.url.includes('/auth/me') &&
                !originalRequest.url.includes('/auth/refresh') &&
                !originalRequest.url.includes('/auth/login')
            ) {
                originalRequest._retry = true;
                isRefreshing = true;
                try {
                    const newToken = await AuthService.refresh();
                    localStorage.setItem('access_token', newToken);
                    api.defaults.headers.Authorization = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    isRefreshing = false;
                    return api.request(originalRequest);
                } catch (err) {
                    isRefreshing = false;
                    localStorage.removeItem('access_token');
                    window.location.href = config.routes.login;
                    return Promise.reject(err);
                }
            }
            return Promise.reject(error);
        },
    );
}

export default useRefreshToken;
