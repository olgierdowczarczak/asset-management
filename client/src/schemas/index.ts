import { type IResourceSchema } from '@/types';
import AccessoriesSchema from './schemas/accessoriesSchema';
import AccessoryInstancesSchema from './schemas/accessoryInstancesSchema';
import AssetsSchema from './schemas/assetsSchema';
import CompaniesSchema from './schemas/companiesSchema';
import DepartmentsSchema from './schemas/departmentsSchema';
import LicensesSchema from './schemas/licensesSchema';
import LicenseInstancesSchema from './schemas/licenseInstancesSchema';
import LocationsSchema from './schemas/locationsSchema';
import UsersSchema from './schemas/usersSchema';

export { default as AccessoriesSchema } from './schemas/accessoriesSchema';
export { default as AccessoryInstancesSchema } from './schemas/accessoryInstancesSchema';
export { default as AssetsSchema } from './schemas/assetsSchema';
export { default as CompaniesSchema } from './schemas/companiesSchema';
export { default as DepartmentsSchema } from './schemas/departmentsSchema';
export { default as LicensesSchema } from './schemas/licensesSchema';
export { default as LicenseInstancesSchema } from './schemas/licenseInstancesSchema';
export { default as LocationsSchema } from './schemas/locationsSchema';
export { default as UsersSchema } from './schemas/usersSchema';

export const schemas: Record<string, IResourceSchema> = {
    accessories: AccessoriesSchema,
    'accessory-instances': AccessoryInstancesSchema,
    assets: AssetsSchema,
    companies: CompaniesSchema,
    departments: DepartmentsSchema,
    licenses: LicensesSchema,
    'license-instances': LicenseInstancesSchema,
    locations: LocationsSchema,
    users: UsersSchema,
};
