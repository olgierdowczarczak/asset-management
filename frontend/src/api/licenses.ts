import api from './api';
import type License from '../types/license';
import type GetResources from '../types/responses/getResources';

export const fetchAccessories = async (): Promise<GetResources<License> | null> => {
    const response = await api.get('/licenses');
    const responseData: GetResources<License> | null = response.data;
    return responseData;
};
