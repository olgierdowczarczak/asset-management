import type PopulatedReference from './populatedReference';

export default interface License {
    id: number;
    name: string;
    quantity: number;
    isDeleted?: boolean;
    assigneeModel?: 'users' | 'locations';
    assignee?: number | PopulatedReference;
}
