import { endpoints } from '@/api';
import type { ILoginForm, ILoginResponse, IUser } from '@/types';
import Service from '../service';

class AccessorieService extends Service {
    async loginRequest(credentials: ILoginForm): Promise<ILoginResponse> {
        const response = await this.sendRequest('post', endpoints.auth.paths.login, {
            body: credentials
        });
        return response.data;
    }

    async logoutRequest(): Promise<void> {
        await this.sendRequest('post', endpoints.auth.paths.logout);
    }

    async refresh(): Promise<string> {
        const response = await this.sendRequest('get', endpoints.auth.paths.refresh);
        return response.data;
    }

    async getMe(): Promise<IUser | null> {
        const response = await this.sendRequest('get', endpoints.auth.paths.getMe);
        const user: IUser | null = response.data;
        return user;
    }
}

export default AccessorieService;
