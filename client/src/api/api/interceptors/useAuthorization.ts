import type { AxiosInstance } from 'axios';
import { StorageConstants } from '@/constants';

function useAuthorization(api: AxiosInstance) {
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem(StorageConstants.accessToken);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}

export default useAuthorization;
