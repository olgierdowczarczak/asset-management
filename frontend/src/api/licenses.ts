import api from './api';
import type License from '../types/license';
import type ResourceResponse from '../types/resourceResponse';

export const fetchAccessories = async (): Promise<ResourceResponse<License> | null> => {
    const response = await api.get('/licenses');
    const responseData: ResourceResponse<License> | null = response.data;
    return responseData;
};
