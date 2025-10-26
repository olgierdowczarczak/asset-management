import { endpoints } from '@/api';
import type { ILoginFormData, IUser } from '@/types';
import Service from '../service';

class AccessorieService extends Service {
    async loginRequest(credentials: ILoginFormData): Promise<IUser | null> {
        const response = await this.sendRequest('post', endpoints.auth.paths.login, {
            body: credentials,
        });
        const user: IUser | null = response.data;
        return user;
    }

    async logoutRequest(): Promise<void> {
        await this.sendRequest('post', endpoints.auth.paths.logout);
    }

    async getMe(): Promise<IUser | null> {
        const response = await this.sendRequest('get', endpoints.auth.paths.getMe);
        const user: IUser | null = response.data;
        return user;
    }
}

export default AccessorieService;
