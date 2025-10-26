import type { AxiosInstance } from 'axios';

type Data = {
    id?: number;
    body?: any;
};

class Service {
    private readonly client: AxiosInstance;
    private readonly route: string;

    constructor(client: AxiosInstance, route: string) {
        this.client = client;
        this.route = route;
    }

    protected async sendRequest(
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        endpoint: string,
        data: Data = {},
    ) {
        // TODO: refactor
        if (endpoint.includes(':id')) {
            endpoint.replace(':id', data.id ? data.id.toString() : '0');
        }
        return await this.client[method](`${this.route}${endpoint}`, data.body);
    }
}

export default Service;
