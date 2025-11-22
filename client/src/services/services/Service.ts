import type { AxiosInstance } from 'axios';

type RequestOptions = {
    params?: Record<string, any>;
    query?: Record<string, any>;
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
        options: RequestOptions = {},
    ) {
        let finalEndpoint: string = endpoint;
        if (options.params) {
            for (const [key, value] of Object.entries(options.params)) {
                finalEndpoint = finalEndpoint.replace(`:${key}`, encodeURIComponent(String(value)));
            }
        }
        const url = `${this.route}${finalEndpoint}`;

        const config = options.query ? { params: options.query } : {};

        if (method === 'get' || method === 'delete') {
            return this.client[method](url, config);
        }
        return this.client[method](url, options.body, config);
    }
}

export default Service;
