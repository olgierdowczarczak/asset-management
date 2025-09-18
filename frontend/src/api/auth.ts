import api from './api';
import type { LoginRequest } from '../types/auth';

export const loginUser = async (credentials: LoginRequest): Promise<void> => {
    await api.post('/api/auth/login', credentials);
};

export const logoutUser = async (): Promise<void> => {
    await api.post('/api/auth/logout');
};
