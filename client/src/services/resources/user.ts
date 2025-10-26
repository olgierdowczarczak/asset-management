import { endpoints } from '@/api';
import type { IMainResource, IUser, IHistoryRecord } from '@/types';
import Service from '../service';

class UserService extends Service implements IMainResource<IUser> {
    async getAll() {
        const response = await this.sendRequest('get', endpoints.users.paths.getAll);
        const users: IUser[] | null = response.data;
        return users;
    }

    async create(data: IUser) {
        const response = await this.sendRequest('get', endpoints.users.paths.create, {
            body: data,
        });
        const user: IUser | null = response.data;
        return user;
    }

    async get(id: number) {
        const response = await this.sendRequest('get', endpoints.users.paths.get, { id });
        const user: IUser | null = response.data;
        return user;
    }

    async edit(id: number, data: IUser) {
        const response = await this.sendRequest('patch', endpoints.users.paths.edit, {
            id,
            body: data,
        });
        const user: IUser | null = response.data;
        return user;
    }

    async delete(id: number) {
        await this.sendRequest('delete', endpoints.users.paths.delete, { id });
    }

    async history(id: number) {
        const response = await this.sendRequest('get', endpoints.users.paths.history, { id });
        const historyRecords: IHistoryRecord[] | null = response.data;
        return historyRecords;
    }

    async historyRecord(id: number) {
        const response = await this.sendRequest('get', endpoints.users.paths.historyRecord, { id });
        const historyRecord: IHistoryRecord | null = response.data;
        return historyRecord;
    }
}

export default UserService;
