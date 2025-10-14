interface Column {
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'date';
}

interface Meta {
    columns: Column[];
}

export default interface GetResources<T> {
    data: T[];
    total: number;
    meta: Meta;
}
