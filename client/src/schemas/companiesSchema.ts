import type { ResourceSchema, PopulatedReference } from './types';

export const companiesSchema: ResourceSchema = {
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

export interface Company {
    id: number;
    name: string;
    owner?: number | PopulatedReference;
}
