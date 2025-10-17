import api from './api';
import type User from '../types/user';
import type GetResources from '../types/responses/getResources';

export const fetchAccessories = async (): Promise<GetResources<User> | null> => {
    const response = await api.get('/users');
    const responseData: GetResources<User> | null = response.data;
    return responseData;
};
