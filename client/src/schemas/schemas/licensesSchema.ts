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
    cost: {
        type: 'number',
        label: 'Cost',
        min: 0,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
        placeholder: 'Enter cost',
        decimalPlaces: 2,
    },
    costType: {
        type: 'enum',
        label: 'Cost Type',
        enumValues: ['per_license', 'total'] as const,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
    },
    billingPeriod: {
        type: 'enum',
        label: 'Billing Period',
        enumValues: ['monthly', 'yearly'] as const,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
    },
    quantity: {
        type: 'number',
        label: 'Quantity',
        required: true,
        default: 0,
        min: 0,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
        placeholder: 'Enter quantity',
    },
};

export default licensesSchema;
