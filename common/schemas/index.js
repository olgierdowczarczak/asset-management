import AccessoriesSchema from './accessoriesSchema.js';
import AssetsSchema from './assetsSchema.js';
import CompaniesSchema from './companiesSchema.js';
import DepartmentsSchema from './departmentsSchema.js';
import LicensesSchema from './licensesSchema.js';
import LocationsSchema from './locationsSchema.js';
import UsersSchema from './usersSchema.js';
import CollectionNames from '../constants/collectionNames.js';

export default {
    [CollectionNames.accessories]: AccessoriesSchema,
    [CollectionNames.assets]: AssetsSchema,
    [CollectionNames.companies]: CompaniesSchema,
    [CollectionNames.departments]: DepartmentsSchema,
    [CollectionNames.licenses]: LicensesSchema,
    [CollectionNames.locations]: LocationsSchema,
    [CollectionNames.users]: UsersSchema
};
