import config from '@/config';
import type { ILoginForm, ILoginResponse, IUser } from '@/types';
import Service from './service';

class AccessorieService extends Service {
    async loginRequest(credentials: ILoginForm): Promise<ILoginResponse> {
        const response = await this.sendRequest('post', config.endpoints.auth.endpoints.login, {
            body: credentials,
        });
        return response.data;
    }

    async logoutRequest(): Promise<void> {
        await this.sendRequest('post', config.endpoints.auth.endpoints.logout);
    }

    async refresh(): Promise<string> {
        const response = await this.sendRequest('get', config.endpoints.auth.endpoints.refresh);
        return response.data;
    }

    async getMe(): Promise<IUser | null> {
        const response = await this.sendRequest('get', config.endpoints.auth.endpoints.getMe);
        return response.data;
    }
}

export default AccessorieService;
