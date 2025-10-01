import api from './api';
import type User from '../types/user';
import type ResourceResponse from '../types/resourceResponse';

export const fetchAccessories = async (): Promise<ResourceResponse<User> | null> => {
    const response = await api.get('/users');
    const responseData: ResourceResponse<User> | null = response.data;
    return responseData;
};
