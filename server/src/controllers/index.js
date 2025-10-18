import CollectionNames from 'asset-management-common/constants/collectionNames.js';
import Accessories from './accessories.js';
import Assets from './assets.js';
import Auth from './auth.js';
import Companies from './companies.js';
import Departments from './departments.js';
import Licenses from './licenses.js';
import Locations from './locations.js';
import Users from './users.js';

export const accessories = new Accessories(CollectionNames.accessories);
export const assets = new Assets(CollectionNames.assets);
export const auth = new Auth();
export const companies = new Companies(CollectionNames.companies);
export const departments = new Departments(CollectionNames.departments);
export const licenses = new Licenses(CollectionNames.licenses);
export const locations = new Locations(CollectionNames.locations);
export const users = new Users(CollectionNames.users);
