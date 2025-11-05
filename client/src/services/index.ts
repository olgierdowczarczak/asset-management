import config from '@/config';
import { client } from '@/api';
import Auth from './services/auth';
import MainResource from './services/MainResource';

export const AuthService = new Auth(client, config.endpoints.auth.name);
export const AccessorieService = new MainResource(client, config.endpoints.accessories);
export const AssetService = new MainResource(client, config.endpoints.assets);
export const LicenseService = new MainResource(client, config.endpoints.licenses);
export const UserService = new MainResource(client, config.endpoints.users);
