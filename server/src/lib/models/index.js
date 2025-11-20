import Collections from 'asset-management-common/schemas/index.js';
import { CollectionNames } from 'asset-management-common/constants/index.js';
import mongoose from 'mongoose';

const getOrCreateModel = (name, schema) => {
    if (mongoose.models[name]) {
        delete mongoose.models[name];
    }
    return mongoose.model(name, schema);
};

export const Accessories = getOrCreateModel(
    CollectionNames.accessories,
    Collections[CollectionNames.accessories],
);
export const AccessoryInstances = getOrCreateModel(
    CollectionNames.accessoryInstances,
    Collections[CollectionNames.accessoryInstances],
);
export const Assets = getOrCreateModel(CollectionNames.assets, Collections[CollectionNames.assets]);
export const Companies = getOrCreateModel(
    CollectionNames.companies,
    Collections[CollectionNames.companies],
);
export const Departments = getOrCreateModel(
    CollectionNames.departments,
    Collections[CollectionNames.departments],
);
export const History = getOrCreateModel(
    CollectionNames.history,
    Collections[CollectionNames.history],
);
export const Jobtitles = getOrCreateModel(
    CollectionNames.jobtitles,
    Collections[CollectionNames.jobtitles],
);
export const Licenses = getOrCreateModel(
    CollectionNames.licenses,
    Collections[CollectionNames.licenses],
);
export const LicenseInstances = getOrCreateModel(
    CollectionNames.licenseInstances,
    Collections[CollectionNames.licenseInstances],
);
export const Locations = getOrCreateModel(
    CollectionNames.locations,
    Collections[CollectionNames.locations],
);
export const Seniorities = getOrCreateModel(
    CollectionNames.seniorities,
    Collections[CollectionNames.seniorities],
);
export const Users = getOrCreateModel(CollectionNames.users, Collections[CollectionNames.users]);

export const models = {
    Accessories,
    AccessoryInstances,
    Assets,
    Companies,
    Departments,
    History,
    Jobtitles,
    Licenses,
    LicenseInstances,
    Locations,
    Seniorities,
    Users,
};
