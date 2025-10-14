import api from './api';
import type Asset from '../types/asset';
import type GetResources from '../types/responses/getResources';

export const fetchAccessories = async (): Promise<GetResources<Asset> | null> => {
    const response = await api.get('/assets');
    const responseData: GetResources<Asset> | null = response.data;
    return responseData;
};
