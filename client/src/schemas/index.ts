import { type IResourceSchema } from '@/types';
import AccessoriesSchema from './schemas/accessoriesSchema';
import AssetsSchema from './schemas/assetsSchema';
import CompaniesSchema from './schemas/companiesSchema';
import DepartmentsSchema from './schemas/departmentsSchema';
import LicensesSchema from './schemas/licensesSchema';
import LocationsSchema from './schemas/locationsSchema';
import UsersSchema from './schemas/usersSchema';

export { default as AccessoriesSchema } from './schemas/accessoriesSchema';
export { default as AssetsSchema } from './schemas/assetsSchema';
export { default as CompaniesSchema } from './schemas/companiesSchema';
export { default as DepartmentsSchema } from './schemas/departmentsSchema';
export { default as LicensesSchema } from './schemas/licensesSchema';
export { default as LocationsSchema } from './schemas/locationsSchema';
export { default as UsersSchema } from './schemas/usersSchema';

export const schemas: Record<string, IResourceSchema> = {
    accessories: AccessoriesSchema,
    assets: AssetsSchema,
    companies: CompaniesSchema,
    departments: DepartmentsSchema,
    licenses: LicensesSchema,
    locations: LocationsSchema,
    users: UsersSchema,
};
