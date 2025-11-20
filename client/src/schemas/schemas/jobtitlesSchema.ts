import type { IResourceSchema } from '@/types';

const jobtitlesSchema: IResourceSchema = {
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
        placeholder: 'Enter job title',
    },
};

export default jobtitlesSchema;
