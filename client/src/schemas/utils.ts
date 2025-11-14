import type { PopulatedReference } from './types';

export function getDisplayValue(
    value: number | PopulatedReference | undefined,
    displayField: string = 'name',
): string {
    if (!value) {
        return '';
    }
    if (typeof value === 'number') {
        return value.toString();
    }

    if (displayField === 'username' && 'username' in value) {
        return value.username || value.id.toString();
    }
    if (displayField === 'name' && 'name' in value) {
        return value.name || value.id.toString();
    }
    if ('firstName' in value && 'lastName' in value) {
        return `${value.firstName} ${value.lastName}`;
    }

    return value.id.toString();
}

export function extractId(value: number | PopulatedReference | undefined): number | undefined {
    if (!value) {
        return undefined;
    }
    if (typeof value === 'number') {
        return value;
    }
    return value.id;
}

export function isPopulatedReference(value: any): value is PopulatedReference {
    return value && typeof value === 'object' && 'id' in value;
}
