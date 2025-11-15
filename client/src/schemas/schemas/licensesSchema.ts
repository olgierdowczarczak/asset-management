import type { IResourceSchema } from '@/types';

const licensesSchema: IResourceSchema = {
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
        placeholder: 'Enter license name',
    },
    quantity: {
        type: 'number',
        label: 'Quantity',
        required: true,
        min: 0,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
        placeholder: 'Enter quantity',
    },
    assigneeModel: {
        type: 'enum',
        label: 'Assignee Type',
        enumValues: ['users', 'locations'] as const,
        required: true,
        showInTable: true,
        showInForm: true,
        showInCreate: true,
        showInEdit: false,
        showInDetail: true,
    },
    assignee: {
        type: 'polymorphicReference',
        label: 'Assigned To',
        modelField: 'assigneeModel',
        displayField: 'name',
        showInTable: true,
        showInForm: true,
        showInCreate: false,
        showInEdit: true,
        showInDetail: true,
    },
};

export default licensesSchema;
