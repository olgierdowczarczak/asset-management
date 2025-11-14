import type { ResourceSchema, PopulatedReference } from './types';

export const locationsSchema: ResourceSchema = {
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
        placeholder: 'Enter location name',
    },
    parent: {
        type: 'reference',
        label: 'Parent Location',
        referencedCollection: 'locations',
        displayField: 'name',
        showInTable: true,
        showInForm: true,
        showInDetail: true,
    },
};

export interface Location {
    id: number;
    name: string;
    parent?: number | PopulatedReference;
}
