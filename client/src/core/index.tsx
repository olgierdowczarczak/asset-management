import config from '@/config';
import * as Services from '@/services';
import MainResourceController from './MainResourceController';

export const AccessorieController = new MainResourceController(
    config.routes.accessories,
    Services.AccessorieService,
);
export const AssetController = new MainResourceController(
    config.routes.assets, 
    Services.AssetService
);
export const LicenseController = new MainResourceController(
    config.routes.licenses,
    Services.LicenseService,
);
export const UserController = new MainResourceController(
    config.routes.users, 
    Services.UserService
);
