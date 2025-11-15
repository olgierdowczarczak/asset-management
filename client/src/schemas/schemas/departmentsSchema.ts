import type { IResourceSchema } from '@/types';

const departmentsSchema: IResourceSchema = {
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
        placeholder: 'Enter department name',
    },
    manager: {
        type: 'reference',
        label: 'Manager',
        referencedCollection: 'users',
        displayField: 'username',
        showInTable: true,
        showInForm: true,
        showInDetail: true,
    },
};

export default departmentsSchema;
