import { getApi } from '../lib/api.ts';

export async function getAsset(assetId: number) {
    const res = await getApi().get(`/api/assets/${assetId}`);
    return res.data;
}

export async function updateAsset(assetId: number, userData: any) {
    const res = await getApi().put(`/api/assets/${assetId}`, userData);
    return res.data;
}

export async function deleteAsset(assetId: number) {
    await getApi().delete(`/api/assets/${assetId}`);
}
