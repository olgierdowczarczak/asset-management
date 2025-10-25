import { routes } from '@/config';
import Accessorie from './modules/accessorie';
import Asset from './modules/asset';
import License from './modules/license';
import User from './modules/user';

export const AccessorieController = new Accessorie(routes.accessories);
export const AssetController = new User(routes.assets);
export const LicenseController = new Asset(routes.licenses);
export const UserController = new License(routes.users);
