import config from '@/config';
import { client } from '@/api';
import Auth from './auth';
import Resource from './resource';

export const AuthService = new Auth(client, config.endpoints.auth.name);
export const AccessorieService = new Resource(client, config.endpoints.accessories);
export const AssetService = new Resource(client, config.endpoints.assets);
export const LicenseService = new Resource(client, config.endpoints.licenses);
export const UserService = new Resource(client, config.endpoints.users);
