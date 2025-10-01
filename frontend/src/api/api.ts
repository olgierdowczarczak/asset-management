import axios from 'axios';
import ROUTES from '../config/routes';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                if (res.status !== 200) {
                    window.location.href = ROUTES.auth.login;
                } else {
                    return api(originalRequest);
                }
            } catch {
                window.location.href = ROUTES.auth.login;
            }
        }

        return Promise.reject(err);
    },
);

export default api;
