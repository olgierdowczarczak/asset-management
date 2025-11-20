import type { IResourceSchema } from '@/types';

const accessoryInstancesSchema: IResourceSchema = {
    instanceNumber: {
        type: 'number',
        label: '#',
        readonly: true,
        showInTable: true,
        showInForm: false,
        showInDetail: true,
    },
    status: {
        type: 'enum',
        label: 'Status',
        enumValues: ['available', 'assigned'] as const,
        readonly: true,
        showInTable: true,
        showInForm: false,
        showInDetail: true,
    },
    assignee: {
        type: 'polymorphicReference',
        label: 'Assigned To',
        modelField: 'assigneeModel',
        displayField: 'name',
        showInTable: true,
        showInForm: false,
        showInDetail: true,
    },
    assignedAt: {
        type: 'string',
        label: 'Assigned At',
        readonly: true,
        showInTable: true,
        showInForm: false,
        showInDetail: true,
    },
};

export default accessoryInstancesSchema;
