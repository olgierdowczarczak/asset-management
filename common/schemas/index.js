import AccessoriesSchema from './accessoriesSchema.js';
import AccessoryInstancesSchema from './accessoryInstancesSchema.js';
import AssetsSchema from './assetsSchema.js';
import CompaniesSchema from './companiesSchema.js';
import DepartmentsSchema from './departmentsSchema.js';
import HistorySchema from './historySchema.js';
import LicensesSchema from './licensesSchema.js';
import LicenseInstancesSchema from './licenseInstancesSchema.js';
import LocationsSchema from './locationsSchema.js';
import UsersSchema from './usersSchema.js';
import CollectionNames from '../constants/collectionNames.js';

export default {
    [CollectionNames.accessories]: AccessoriesSchema,
    [CollectionNames.accessoryInstances]: AccessoryInstancesSchema,
    [CollectionNames.assets]: AssetsSchema,
    [CollectionNames.companies]: CompaniesSchema,
    [CollectionNames.departments]: DepartmentsSchema,
    [CollectionNames.history]: HistorySchema,
    [CollectionNames.licenses]: LicensesSchema,
    [CollectionNames.licenseInstances]: LicenseInstancesSchema,
    [CollectionNames.locations]: LocationsSchema,
    [CollectionNames.users]: UsersSchema
};
