import axios from 'axios';
import useInterceptors from './interceptors';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true
});

export default useInterceptors(api);
