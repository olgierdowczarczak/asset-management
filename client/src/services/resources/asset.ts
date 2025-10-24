import { endpoints } from '@/api';
import type { IMainResource, IAsset } from '@/types';
import Service from '../service';

class AssetService extends Service implements IMainResource<IAsset> {
    async getAll() { return []; }
    async create(data: IAsset) { return data; }
    async get(id: number) { return null; }
    async edit(id: number, data: IAsset) { return data; }
    async delete() {  }
    async history(id: number) { return [] }
}

export default AssetService;
