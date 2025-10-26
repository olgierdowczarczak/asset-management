import type IHistoryRecord from '../resources/historyRecord';

export interface IResource<T> {
    getAll: () => Promise<T[] | null>;
    create: (data: T) => Promise<T | null>;
    get: (id: number) => Promise<T | null>;
    edit: (id: number, data: T) => Promise<T | null>;
    delete: (id: number) => Promise<void>;
}

export interface IMainResource<T> extends IResource<T> {
    history: (id: number) => Promise<IHistoryRecord[] | null>;
    historyRecord: (id: number, recordId: number) => Promise<IHistoryRecord | null>;
}
