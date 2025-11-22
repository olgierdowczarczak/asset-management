import type { IResourceSchema } from '@/types';

const senioritiesSchema: IResourceSchema = {
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
        maxLength: 63,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
        placeholder: 'Enter seniority level',
    },
};

export default senioritiesSchema;
