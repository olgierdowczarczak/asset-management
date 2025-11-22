import type PopulatedReference from './populatedReference';

export default interface Company {
    id: number;
    name: string;
    owner?: number | PopulatedReference;
}
