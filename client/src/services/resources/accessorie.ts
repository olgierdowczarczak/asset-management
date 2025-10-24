import { endpoints } from '@/api';
import type { IMainResource, IAccessorie, IHistoryRecord } from '@/types';
import Service from '../service';

class AccessorieService extends Service implements IMainResource<IAccessorie> {
    async getAll() {
        const response = await this.sendRequest('get', endpoints.accessorie.paths.getAll);
        const accessories: IAccessorie[] | null = response.data;
        return accessories;
    }

    async create(data: IAccessorie) { 
        const response = await this.sendRequest('get', endpoints.accessorie.paths.create, { body: data });
        const accessorie: IAccessorie | null = response.data;
        return accessorie; 
    }

    async get(id: number) { 
        const response = await this.sendRequest('get', endpoints.accessorie.paths.get, { id });
        const accessorie: IAccessorie | null = response.data;
        return accessorie; 
    }

    async edit(id: number, data: IAccessorie) { 
        const response = await this.sendRequest('patch', endpoints.accessorie.paths.edit, { id, body: data });
        const accessorie: IAccessorie | null = response.data;
        return accessorie; 
    }

    async delete(id: number) { 
        await this.sendRequest('delete', endpoints.accessorie.paths.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', endpoints.accessorie.paths.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }
}

export default AccessorieService;
