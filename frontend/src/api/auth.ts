import { getApi } from '../lib/api.ts';

export type Credentials = {
    username: string;
    password: string;
};

export async function login(credentials: Credentials) {
    const res = await getApi().post('/api/auth/login', credentials);
    return res.data['token'];
}

export async function logout() {
    await getApi().post('/api/auth/logout');
}
