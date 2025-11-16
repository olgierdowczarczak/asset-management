import type { IPopulatedReference } from '@/types';

export function getDisplayValue(
    value: number | IPopulatedReference | undefined,
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
    if (displayField === 'fullName' || ('firstName' in value && 'lastName' in value)) {
        const firstName = value.firstName || '';
        const middleName = value.middleName || '';
        const lastName = value.lastName || '';
        const parts = [firstName, middleName, lastName].filter(Boolean);
        return parts.length > 0 ? parts.join(' ') : value.id.toString();
    }

    return value.id.toString();
}

export function extractId(value: number | IPopulatedReference | undefined): number | undefined {
    if (!value) {
        return undefined;
    }
    if (typeof value === 'number') {
        return value;
    }
    return value.id;
}

export function isPopulatedReference(value: any): value is IPopulatedReference {
    return value && typeof value === 'object' && 'id' in value;
}

export function getCollectionPath(collection: string): string {
    return collection;
}
