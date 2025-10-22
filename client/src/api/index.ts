import axios from 'axios';

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
});

export const endpoints = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        GET_ME: '/auth/me'
    }
};
