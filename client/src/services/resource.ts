import config from '@/config';
import type { IMainResource, IHistoryRecord } from '@/types';
import Service from './service';

class Resource<R> extends Service implements IMainResource<R> {
    async getAll() {
        const response = await this.sendRequest('get', config.endpoints.resource.getAll);
        const resources: R[] | null = response.data;
        return resources;
    }

    async create(data: R) {
        const response = await this.sendRequest('get', config.endpoints.resource.create, {
            body: data,
        });
        const resource: R | null = response.data;
        return resource;
    }

    async get(id: number) {
        const response = await this.sendRequest('get', config.endpoints.resource.get, { id });
        const resource: R | null = response.data;
        return resource;
    }

    async edit(id: number, data: R) {
        const response = await this.sendRequest('patch', config.endpoints.resource.edit, {
            id,
            body: data,
        });
        const resource: R | null = response.data;
        return resource;
    }

    async delete(id: number) {
        await this.sendRequest('delete', config.endpoints.resource.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', config.endpoints.resource.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }

    async historyRecord(id: number) {
        const response = await this.sendRequest('get', config.endpoints.resource.historyRecord, {
            id,
        });
        const historyRecord: IHistoryRecord | null = response.data;
        return historyRecord;
    }
}

export default Resource;
