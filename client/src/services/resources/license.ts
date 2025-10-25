import { endpoints } from '@/api';
import type { IMainResource, ILicense, IHistoryRecord } from '@/types';
import Service from '../service';

class LicenseService extends Service implements IMainResource<ILicense> {
    async getAll() {
        const response = await this.sendRequest('get', endpoints.license.paths.getAll);
        const licenses: ILicense[] | null = response.data;
        return licenses;
    }

    async create(data: ILicense) { 
        const response = await this.sendRequest('get', endpoints.license.paths.create, { body: data });
        const license: ILicense | null = response.data;
        return license; 
    }

    async get(id: number) { 
        const response = await this.sendRequest('get', endpoints.license.paths.get, { id });
        const license: ILicense | null = response.data;
        return license; 
    }

    async edit(id: number, data: ILicense) { 
        const response = await this.sendRequest('patch', endpoints.license.paths.edit, { id, body: data });
        const license: ILicense | null = response.data;
        return license; 
    }

    async delete(id: number) { 
        await this.sendRequest('delete', endpoints.license.paths.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', endpoints.license.paths.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }
}

export default LicenseService;
