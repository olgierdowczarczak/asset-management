import type { IResourceSchema } from '@/types';

const companiesSchema: IResourceSchema = {
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
        placeholder: 'Enter company name',
    },
    owner: {
        type: 'reference',
        label: 'Owner',
        referencedCollection: 'users',
        displayField: 'username',
        showInTable: true,
        showInForm: true,
        showInDetail: true,
    },
};

export default companiesSchema;
