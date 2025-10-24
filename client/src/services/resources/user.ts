import { endpoints } from '@/api';
import type { IMainResource, IUser } from '@/types';
import Service from '../service';

class UserService extends Service implements IMainResource<IUser> {
    async getAll() { return []; }
    async create(data: IUser) { return data; }
    async get(id: number) { return null; }
    async edit(id: number, data: IUser) { return data; }
    async delete() {  }
    async history(id: number) { return [] }
}

export default UserService;
