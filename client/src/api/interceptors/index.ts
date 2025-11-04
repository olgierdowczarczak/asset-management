import type { AxiosInstance } from 'axios';
import useAuthorization from './useAuthorization';
import useRefreshToken from './useRefreshToken';

export default function(api: AxiosInstance) {
    useAuthorization(api);
    useRefreshToken(api);
    return api;
}