import type IHistoryRecord from './historyRecord';

export interface IPaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface IMethodsResource<T> {
    getAll: (page?: number, limit?: number) => Promise<IPaginatedResponse<T>>;
    create: (data: Partial<T>) => Promise<T>;
    get: (id: number) => Promise<T | null>;
    edit: (id: number, data: Partial<T>) => Promise<T | null>;
    delete: (id: number) => Promise<void | null>;
}

export interface IMethodsMainResource<T> {
    getAll: (page?: number, limit?: number) => Promise<IPaginatedResponse<T>>;
    create: (data: Partial<T>) => Promise<T>;
    get: (id: number) => Promise<T | null>;
    edit: (id: number, data: Partial<T>) => Promise<T | null>;
    delete: (id: number) => Promise<void | null>;
    historyRecords: (id: number) => Promise<IHistoryRecord[]>;
    historyRecord: (id: number, recordId: number) => Promise<IHistoryRecord | null>;
}

export interface IMethods<T> {
    getAll: (page?: number, limit?: number) => Promise<IPaginatedResponse<T>>;
    create: (data: Partial<T>) => Promise<T>;
    get: (id: number) => Promise<T | null>;
    edit: (id: number, data: Partial<T>) => Promise<T | null>;
    delete: (id: number) => Promise<void | null>;
    historyRecords: (id: number) => Promise<IHistoryRecord[]>;
    historyRecord: (id: number, recordId: number) => Promise<IHistoryRecord | null>;
}
