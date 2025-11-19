import Collections from 'asset-management-common/schemas/index.js';
import { CollectionNames } from 'asset-management-common/constants/index.js';
import mongoose from 'mongoose';

export const Accessories = mongoose.model(
    CollectionNames.accessories,
    Collections[CollectionNames.accessories],
);
export const AccessoryInstances = mongoose.model(
    CollectionNames.accessoryInstances,
    Collections[CollectionNames.accessoryInstances],
);
export const Assets = mongoose.model(CollectionNames.assets, Collections[CollectionNames.assets]);
export const Companies = mongoose.model(
    CollectionNames.companies,
    Collections[CollectionNames.companies],
);
export const Departments = mongoose.model(
    CollectionNames.departments,
    Collections[CollectionNames.departments],
);
export const History = mongoose.model(
    CollectionNames.history,
    Collections[CollectionNames.history],
);
export const Licenses = mongoose.model(
    CollectionNames.licenses,
    Collections[CollectionNames.licenses],
);
export const LicenseInstances = mongoose.model(
    CollectionNames.licenseInstances,
    Collections[CollectionNames.licenseInstances],
);
export const Locations = mongoose.model(
    CollectionNames.locations,
    Collections[CollectionNames.locations],
);
export const Users = mongoose.model(CollectionNames.users, Collections[CollectionNames.users]);

export const models = {
    Accessories,
    AccessoryInstances,
    Assets,
    Companies,
    Departments,
    History,
    Licenses,
    LicenseInstances,
    Locations,
    Users,
};
