import axios from 'axios';
import useInterceptors from './interceptors';
import { HttpConstants } from '@/constants';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
    timeout: HttpConstants.requestTimeoutMs,
});

export default useInterceptors(api);
