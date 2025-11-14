import type { ResourceSchema, PopulatedReference } from './types';

export const assetsSchema: ResourceSchema = {
    id: {
        type: 'number',
        label: 'ID',
        readonly: true,
        showInTable: true,
        showInForm: false,
        showInDetail: true,
    },
    name: {
        type: 'string',
        label: 'Name',
        required: true,
        minLength: 2,
        maxLength: 31,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
        placeholder: 'Enter asset name',
    },
    assigneeModel: {
        type: 'enum',
        label: 'Assignee Type',
        enumValues: ['users', 'locations'] as const,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
    },
    assignee: {
        type: 'polymorphicReference',
        label: 'Assigned To',
        modelField: 'assigneeModel',
        displayField: 'name',
        showInTable: true,
        showInForm: true,
        showInDetail: true,
    },
};

export interface Asset {
    id: number;
    name: string;
    isDeleted?: boolean;
    assigneeModel?: 'users' | 'locations';
    assignee?: number | PopulatedReference;
}
