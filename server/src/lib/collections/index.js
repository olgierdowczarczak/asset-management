import Collections from 'asset-management-common/schemas/index.js';
import CollectionNames from 'asset-management-common/constants/collectionNames.js';
import mongoose from 'mongoose';

export const Accessories = mongoose.model('accessories', Collections[CollectionNames.accessories]);
export const Assets = mongoose.model('assets', Collections[CollectionNames.assets]);
export const Companies = mongoose.model('companies', Collections[CollectionNames.companies]);
export const Departments = mongoose.model('departments', Collections[CollectionNames.departments]);
export const Licenses = mongoose.model('licenses', Collections[CollectionNames.licenses]);
export const Locations = mongoose.model('locations', Collections[CollectionNames.locations]);
export const Users = mongoose.model('users', Collections[CollectionNames.users]);
