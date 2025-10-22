import { api, endpoints } from './index';
import type { LoginFormData, User } from '../types';

export const loginRequest = async(credentials: LoginFormData): Promise<User | null> => {
    const response = await api.post(endpoints.AUTH.LOGIN, credentials);
    const user: User | null = response.data;
    return user;
};

export const logoutRequest = async(): Promise<void> => {
    await api.post(endpoints.AUTH.LOGOUT);
};

export const getMe = async(): Promise<User | null> => {
    const response = await api.get(endpoints.AUTH.GET_ME);
    const user: User | null = response.data;
    return user;
};
