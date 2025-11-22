import { type IResourceSchema } from '@/types';
import AccessoriesSchema from './schemas/accessoriesSchema';
import AccessoryInstancesSchema from './schemas/accessoryInstancesSchema';
import AssetsSchema from './schemas/assetsSchema';
import CompaniesSchema from './schemas/companiesSchema';
import DepartmentsSchema from './schemas/departmentsSchema';
import JobtitlesSchema from './schemas/jobtitlesSchema';
import LicensesSchema from './schemas/licensesSchema';
import LicenseInstancesSchema from './schemas/licenseInstancesSchema';
import LocationsSchema from './schemas/locationsSchema';
import SenioritiesSchema from './schemas/senioritiesSchema';
import UsersSchema from './schemas/usersSchema';

export { default as AccessoriesSchema } from './schemas/accessoriesSchema';
export { default as AccessoryInstancesSchema } from './schemas/accessoryInstancesSchema';
export { default as AssetsSchema } from './schemas/assetsSchema';
export { default as CompaniesSchema } from './schemas/companiesSchema';
export { default as DepartmentsSchema } from './schemas/departmentsSchema';
export { default as JobtitlesSchema } from './schemas/jobtitlesSchema';
export { default as LicensesSchema } from './schemas/licensesSchema';
export { default as LicenseInstancesSchema } from './schemas/licenseInstancesSchema';
export { default as LocationsSchema } from './schemas/locationsSchema';
export { default as SenioritiesSchema } from './schemas/senioritiesSchema';
export { default as UsersSchema } from './schemas/usersSchema';
export type { User } from './schemas/usersSchema';

export const schemas: Record<string, IResourceSchema> = {
    accessories: AccessoriesSchema,
    'accessory-instances': AccessoryInstancesSchema,
    assets: AssetsSchema,
    companies: CompaniesSchema,
    departments: DepartmentsSchema,
    jobtitles: JobtitlesSchema,
    licenses: LicensesSchema,
    'license-instances': LicenseInstancesSchema,
    locations: LocationsSchema,
    seniorities: SenioritiesSchema,
    users: UsersSchema,
};
