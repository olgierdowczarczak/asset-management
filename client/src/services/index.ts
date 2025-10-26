import { client, endpoints } from '@/api';
import Auth from './auth/auth';
import Accessorie from './resources/accessorie';
import Asset from './resources/asset';
import License from './resources/license';
import User from './resources/user';

export const AuthService = new Auth(client, endpoints.auth.name);
export const AccessorieService = new Accessorie(client, endpoints.accessories.name);
export const AssetService = new Asset(client, endpoints.assets.name);
export const LicenseService = new License(client, endpoints.licenses.name);
export const UserService = new User(client, endpoints.users.name);
