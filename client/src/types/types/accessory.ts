import type PopulatedReference from './populatedReference';

export default interface Accessory {
    id: number;
    name: string;
    quantity: number;
    isDeleted?: boolean;
    assigneeModel?: 'users' | 'locations';
    assignee?: number | PopulatedReference;
}
