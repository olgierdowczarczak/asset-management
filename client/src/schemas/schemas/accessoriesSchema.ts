import type { IResourceSchema } from '@/types';

const accessoriesSchema: IResourceSchema = {
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
        placeholder: 'Enter accessory name',
    },
    cost: {
        type: 'number',
        label: 'Cost',
        min: 0,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
        placeholder: 'Enter cost',
    },
    quantity: {
        type: 'number',
        label: 'Quantity',
        default: 0,
        min: 0,
        showInTable: true,
        showInForm: true,
        showInDetail: true,
        placeholder: '0',
    },
};

export default accessoriesSchema;
