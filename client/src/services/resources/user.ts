import { endpoints } from '@/api';
import type { IMainResource, IUser, IHistoryRecord } from '@/types';
import Service from '../service';

class UserService extends Service implements IMainResource<IUser> {
    async getAll() {
        const response = await this.sendRequest('get', endpoints.user.paths.getAll);
        const users: IUser[] | null = response.data;
        return users;
    }

    async create(data: IUser) { 
        const response = await this.sendRequest('get', endpoints.user.paths.create, { body: data });
        const user: IUser | null = response.data;
        return user; 
    }

    async get(id: number) { 
        const response = await this.sendRequest('get', endpoints.user.paths.get, { id });
        const user: IUser | null = response.data;
        return user; 
    }

    async edit(id: number, data: IUser) { 
        const response = await this.sendRequest('patch', endpoints.user.paths.edit, { id, body: data });
        const user: IUser | null = response.data;
        return user; 
    }

    async delete(id: number) { 
        await this.sendRequest('delete', endpoints.user.paths.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', endpoints.user.paths.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }
}

export default UserService;
