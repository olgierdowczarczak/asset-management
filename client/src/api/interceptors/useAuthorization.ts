import type { AxiosInstance } from 'axios';

function useAuthorization(api: AxiosInstance) {
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}

export default useAuthorization;