import { endpoints } from '@/api';
import type { IMainResource, ILicense } from '@/types';
import Service from '../service';

class LicenseService extends Service implements IMainResource<ILicense> {
    async getAll() { return []; }
    async create(data: ILicense) { return data; }
    async get(id: number) { return null; }
    async edit(id: number, data: ILicense) { return data; }
    async delete() {  }
    async history(id: number) { return [] }
}

export default LicenseService;
