import type { IMethodsMainResource } from '@/types';
import config from '@/config';
import Service from './Service';

class Resource<T> extends Service implements IMethodsMainResource<T> {
    async getAll() {
        const response = await this.sendRequest('get', config.endpoints.resource.getAll);
        return response.data;
    }

    async create(data: T) {
        const response = await this.sendRequest('get', config.endpoints.resource.create, { body: data });
        return response.data;
    }

    async get(id: number) {
        const response = await this.sendRequest('get', config.endpoints.resource.get, { params: [id] });
        return response.data;
    }

    async edit(id: number, data: T) {
        const response = await this.sendRequest('patch', config.endpoints.resource.edit, { params: [id], body: data });
        return response.data;
    }

    async delete(id: number) {
        const response = await this.sendRequest('delete', config.endpoints.resource.delete, { params: [id] });
        return response.data;
    }

    async historyRecords(id: number) {
        const response = await this.sendRequest('get', config.endpoints.resource.history, { params: [id] });
        return response.data;
    }

    async historyRecord(id: number) {
        const response = await this.sendRequest('get', config.endpoints.resource.historyRecord, { params: [id] });
        return response.data;
    }
}

export default Resource;
