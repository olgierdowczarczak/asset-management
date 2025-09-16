import { getApi } from '../lib/api.ts';

export async function createAsset(asetData: any) {
    const res = await getApi().post('/api/assets', asetData);
    return res.data;
}

export async function getActiveAssets(query: string) {
    const res = await getApi().get(`/api/assets/${query}`);
    return res.data;
}

export async function getAllAssets() {
    const res = await getApi().get('/api/assets/all');
    return res.data;
}

export async function getDeletedAssets() {
    const res = await getApi().get('/api/assets/deleted');
    return res.data;
}
