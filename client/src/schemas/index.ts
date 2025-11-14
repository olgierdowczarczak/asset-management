export * from './types';
export * from './accessoriesSchema';
export * from './assetsSchema';
export * from './companiesSchema';
export * from './departmentsSchema';
export * from './licensesSchema';
export * from './locationsSchema';
export * from './usersSchema';

import { accessoriesSchema } from './accessoriesSchema';
import { assetsSchema } from './assetsSchema';
import { companiesSchema } from './companiesSchema';
import { departmentsSchema } from './departmentsSchema';
import { licensesSchema } from './licensesSchema';
import { locationsSchema } from './locationsSchema';
import { usersSchema } from './usersSchema';
import type { ResourceSchema } from './types';

export const schemas: Record<string, ResourceSchema> = {
    accessories: accessoriesSchema,
    assets: assetsSchema,
    companies: companiesSchema,
    departments: departmentsSchema,
    licenses: licensesSchema,
    locations: locationsSchema,
    users: usersSchema,
};
