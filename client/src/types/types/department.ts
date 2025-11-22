import type PopulatedReference from './populatedReference';

export default interface Department {
    id: number;
    name: string;
    manager?: number | PopulatedReference;
}
