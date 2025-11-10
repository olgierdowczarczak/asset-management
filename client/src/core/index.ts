import config from '@/config';
import * as Services from '@/services';
import MainResource from './controllers/MainResource';

export const AccessoriesController = new MainResource(
    config.routes.accessories,
    Services.AccessorieService,
);
export const AssetsController = new MainResource(
    config.routes.assets,
    Services.AssetService,
);
export const LicensesController = new MainResource(
    config.routes.licenses,
    Services.LicenseService,
);
export const UsersController = new MainResource(
    config.routes.users, 
    Services.UserService
);
