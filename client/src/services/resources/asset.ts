import { endpoints } from '@/api';
import type { IMainResource, IAsset, IHistoryRecord } from '@/types';
import Service from '../service';

class AssetService extends Service implements IMainResource<IAsset> {
    async getAll() {
        const response = await this.sendRequest('get', endpoints.assets.paths.getAll);
        const assets: IAsset[] | null = response.data;
        return assets;
    }

    async create(data: IAsset) {
        const response = await this.sendRequest('get', endpoints.assets.paths.create, {
            body: data,
        });
        const asset: IAsset | null = response.data;
        return asset;
    }

    async get(id: number) {
        const response = await this.sendRequest('get', endpoints.assets.paths.get, { id });
        const asset: IAsset | null = response.data;
        return asset;
    }

    async edit(id: number, data: IAsset) {
        const response = await this.sendRequest('patch', endpoints.assets.paths.edit, {
            id,
            body: data,
        });
        const asset: IAsset | null = response.data;
        return asset;
    }

    async delete(id: number) {
        await this.sendRequest('delete', endpoints.assets.paths.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', endpoints.assets.paths.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }

    async historyRecord(id: number) {
        const response = await this.sendRequest('get', endpoints.assets.paths.historyRecord, {
            id,
        });
        const historyRecord: IHistoryRecord | null = response.data;
        return historyRecord;
    }
}

export default AssetService;
