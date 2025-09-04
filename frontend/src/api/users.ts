import { getApi } from '../lib/api.ts';

export async function createUser(userData: any) {
    const res = await getApi().post('/api/users', userData);
    return res.data;
};

export async function getActiveUsers(query: string) {
    const res = await getApi().get(`/api/users/${query}`);
    return res.data;
};

export async function getAllUsers() {
    const res = await getApi().get('/api/users/all');
    return res.data;
};

export async function getDeletedUsers() {
    const res = await getApi().get('/api/users/deleted');
    return res.data;
};