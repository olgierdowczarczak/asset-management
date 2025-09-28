import api from './api';
import type Accessorie from '../types/accessorie';
import type ResourceResponse from '../types/resourceResponse';

export const fetchAccessories = async (): Promise<ResourceResponse<Accessorie> | null> => {
    const response = await api.get('/accessories');
    const responseData: ResourceResponse<Accessorie> | null = response.data;
    return responseData;
};
