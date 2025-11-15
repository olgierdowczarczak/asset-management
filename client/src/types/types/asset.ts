import type PopulatedReference from './populatedReference';

export default interface Asset {
    id: number;
    name: string;
    isDeleted?: boolean;
    assigneeModel?: 'users' | 'locations';
    assignee?: number | PopulatedReference;
}
