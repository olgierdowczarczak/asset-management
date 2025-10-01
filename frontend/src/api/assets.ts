import api from './api';
import type Asset from '../types/asset';
import type ResourceResponse from '../types/resourceResponse';

export const fetchAccessories = async (): Promise<ResourceResponse<Asset> | null> => {
    const response = await api.get('/assets');
    const responseData: ResourceResponse<Asset> | null = response.data;
    return responseData;
};
