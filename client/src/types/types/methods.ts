import type IHistoryRecord from './historyRecord';

export interface IMethodsResource<T> {
    getAll: () => Promise<T[]>;
    create: (data: Partial<T>) => Promise<T>;
    get: (id: number) => Promise<T | null>;
    edit: (id: number, data: Partial<T>) => Promise<T | null>;
    delete: (id: number) => Promise<void | null>;
}

export interface IMethodsMainResource<T> {
    getAll: () => Promise<T[]>;
    create: (data: Partial<T>) => Promise<T>;
    get: (id: number) => Promise<T | null>;
    edit: (id: number, data: Partial<T>) => Promise<T | null>;
    delete: (id: number) => Promise<void | null>;
    historyRecords: (id: number) => Promise<IHistoryRecord[]>;
    historyRecord: (id: number, recordId: number) => Promise<IHistoryRecord | null>;
}

export interface IMethods<T> {
    getAll: () => Promise<T[]>;
    create: (data: Partial<T>) => Promise<T>;
    get: (id: number) => Promise<T | null>;
    edit: (id: number, data: Partial<T>) => Promise<T | null>;
    delete: (id: number) => Promise<void | null>;
    historyRecords: (id: number) => Promise<IHistoryRecord[]>;
    historyRecord: (id: number, recordId: number) => Promise<IHistoryRecord | null>;
}
