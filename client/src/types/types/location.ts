import type PopulatedReference from './populatedReference';

export default interface Location {
    id: number;
    name: string;
    parent?: number | PopulatedReference;
}
