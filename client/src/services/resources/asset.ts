import { endpoints } from '@/api';
import type { IMainResource, IAsset, IHistoryRecord } from '@/types';
import Service from '../service';

class AssetService extends Service implements IMainResource<IAsset> {
    async getAll() {
        const response = await this.sendRequest('get', endpoints.asset.paths.getAll);
        const assets: IAsset[] | null = response.data;
        return assets;
    }

    async create(data: IAsset) { 
        const response = await this.sendRequest('get', endpoints.asset.paths.create, { body: data });
        const asset: IAsset | null = response.data;
        return asset; 
    }

    async get(id: number) { 
        const response = await this.sendRequest('get', endpoints.asset.paths.get, { id });
        const asset: IAsset | null = response.data;
        return asset; 
    }

    async edit(id: number, data: IAsset) { 
        const response = await this.sendRequest('patch', endpoints.asset.paths.edit, { id, body: data });
        const asset: IAsset | null = response.data;
        return asset; 
    }

    async delete(id: number) { 
        await this.sendRequest('delete', endpoints.asset.paths.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', endpoints.asset.paths.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }
}

export default AssetService;
