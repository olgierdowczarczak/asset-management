import api from './api';
import type LoginRequest from '../types/auth';
import type User from '../types/user';

export const loginUser = async (credentials: LoginRequest): Promise<User | null> => {
    const response = await api.post('/auth/login', credentials);
    const user: User = response.data;
    return user;
};

export const logoutUser = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export const getMe = async (): Promise<User | null> => {
    const response = await api.get('/auth/me');
    const user: User = response.data;
    return user;
};
