import { CollectionNames } from 'asset-management-common/constants/index.js';
import Auth from './auth.js';
import Model from './model.js';

export const auth = new Auth();
export const accessories = new Model(CollectionNames.accessories);
export const assets = new Model(CollectionNames.assets);
export const companies = new Model(CollectionNames.companies);
export const departments = new Model(CollectionNames.departments);
export const licenses = new Model(CollectionNames.licenses);
export const locations = new Model(CollectionNames.locations);
export const users = new Model(CollectionNames.users);
