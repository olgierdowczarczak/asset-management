import type { IMethods } from '@/types';
import PageHandler from './PageHandler';

export class Methods<T> extends PageHandler<IMethods<T>> {
    getAll = async () => this.service.getAll();
    create = async (data: T) => this.service.create(data);
    get = async (id: number) => this.service.get(id);
    edit = async (id: number, data: T) => this.service.edit(id, data);
    delete = async (id: number) => this.service.delete(id);
    historyRecords = async (id: number) => this.service.historyRecords(id);
    historyRecord = async (id: number, recordId: number) =>
        this.service.historyRecord(id, recordId);
}
