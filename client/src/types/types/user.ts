import type PopulatedReference from './populatedReference';

export default interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    location?: number | PopulatedReference;
    company?: number | PopulatedReference;
    department?: number | PopulatedReference;
    isRemote?: boolean;
    isRemembered?: boolean;
    isDeleted?: boolean;
}
