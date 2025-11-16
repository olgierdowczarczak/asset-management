import type { AxiosInstance } from 'axios';
import config from '@/config';
import { AuthService } from '@/services';

function useRefreshToken(api: AxiosInstance) {
    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config;
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url.includes('/auth/me')
            ) {
                try {
                    const newToken = await AuthService.refresh();
                    localStorage.setItem('access_token', newToken);
                    api.defaults.headers.Authorization = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api.request(originalRequest);
                } catch (err) {
                    localStorage.removeItem('access_token');
                    window.location.href = config.routes.login;
                    return Promise.reject(err);
                }
            }
        },
    );
}

export default useRefreshToken;
