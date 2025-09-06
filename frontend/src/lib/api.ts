import axios from 'axios';
import type { AxiosInstance } from 'axios';

let api: AxiosInstance | null = null;

export const updateApi = (token: string) => {
    if (api) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getApi = (): AxiosInstance => {
    if (!api) {
        api = axios.create({
            baseURL: import.meta.env.VITE_API_SERVER_URL,
        });

        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return api;
};

export const removeApiHeaders = () => {
    if (api) delete api.defaults.headers.common['Authorization'];
};
