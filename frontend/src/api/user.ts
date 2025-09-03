import { getApi } from '../lib/api.ts';

export async function getUser(userId: string) {
    const res = await getApi().get(`/api/users/${userId}`);
    return res.data;
};

export async function updateUser(userId: string, userData: any) {
    const res = await getApi().put(`/api/users/${userId}`, userData);
    return res.data;
};

export async function deleteUser(userId: string) {
    await getApi().delete(`/api/users/${userId}`);
};