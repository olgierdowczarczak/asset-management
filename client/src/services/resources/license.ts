import { endpoints } from '@/api';
import type { IMainResource, ILicense, IHistoryRecord } from '@/types';
import Service from '../service';

class LicenseService extends Service implements IMainResource<ILicense> {
    async getAll() {
        const response = await this.sendRequest('get', endpoints.licenses.paths.getAll);
        const licenses: ILicense[] | null = response.data;
        return licenses;
    }

    async create(data: ILicense) {
        const response = await this.sendRequest('get', endpoints.licenses.paths.create, {
            body: data,
        });
        const license: ILicense | null = response.data;
        return license;
    }

    async get(id: number) {
        const response = await this.sendRequest('get', endpoints.licenses.paths.get, { id });
        const license: ILicense | null = response.data;
        return license;
    }

    async edit(id: number, data: ILicense) {
        const response = await this.sendRequest('patch', endpoints.licenses.paths.edit, {
            id,
            body: data,
        });
        const license: ILicense | null = response.data;
        return license;
    }

    async delete(id: number) {
        await this.sendRequest('delete', endpoints.licenses.paths.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', endpoints.licenses.paths.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }

    async historyRecord(id: number) {
        const response = await this.sendRequest('get', endpoints.licenses.paths.historyRecord, {
            id,
        });
        const historyRecord: IHistoryRecord | null = response.data;
        return historyRecord;
    }
}

export default LicenseService;
