import api from './api';
import type Accessorie from '../types/accessorie';
import type GetResources from '../types/responses/getResources';

export const fetchAccessories = async (): Promise<GetResources<Accessorie> | null> => {
    const response = await api.get('/accessories');
    const responseData: GetResources<Accessorie> | null = response.data;
    return responseData;
};
