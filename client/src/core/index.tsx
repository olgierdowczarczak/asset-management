import { routes } from '@/config';
import * as Services from '@/services';
import MainResourceController from './MainResourceController';

export const AccessorieController = new MainResourceController(
    routes.accessories,
    Services.AccessorieService,
);
export const AssetController = new MainResourceController(routes.assets, Services.AssetService);
export const LicenseController = new MainResourceController(
    routes.licenses,
    Services.LicenseService,
);
export const UserController = new MainResourceController(routes.users, Services.UserService);
