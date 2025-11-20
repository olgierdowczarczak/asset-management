import { CollectionNames } from 'asset-management-common/constants/index.js';
import Auth from './auth.js';
import History from './history.js';
import Model from './model.js';
import Instance from './instance.js';

export const auth = new Auth();
export const accessories = new Model(CollectionNames.accessories);
export const accessoryInstances = new Instance(CollectionNames.accessories);
export const assets = new Model(CollectionNames.assets);
export const companies = new Model(CollectionNames.companies);
export const departments = new Model(CollectionNames.departments);
export const history = new History();
export const jobtitles = new Model(CollectionNames.jobtitles);
export const licenses = new Model(CollectionNames.licenses);
export const licenseInstances = new Instance(CollectionNames.licenses);
export const locations = new Model(CollectionNames.locations);
export const seniorities = new Model(CollectionNames.seniorities);
export const users = new Model(CollectionNames.users);
