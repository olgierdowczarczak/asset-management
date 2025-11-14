import config from '@/config';
import { client } from '@/api';
import Auth from './services/Auth';
import MainResource from './services/MainResource';

export const AuthService = new Auth(client, config.endpoints.auth.name);
export const AccessorieService = new MainResource(client, config.endpoints.accessories);
export const AssetService = new MainResource(client, config.endpoints.assets);
export const CompanyService = new MainResource(client, config.endpoints.companies);
export const DepartmentService = new MainResource(client, config.endpoints.departments);
export const LicenseService = new MainResource(client, config.endpoints.licenses);
export const LocationService = new MainResource(client, config.endpoints.locations);
export const UserService = new MainResource(client, config.endpoints.users);
