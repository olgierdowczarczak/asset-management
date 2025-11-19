import config from '@/config';
import * as Services from '@/services';
import * as Schemas from '@/schemas';
import MainResource from './controllers/MainResource';
import InstanceMasterResource from './controllers/InstanceMasterResource';

export const AccessoriesController = new InstanceMasterResource(
    config.routes.accessories,
    Services.AccessorieService,
    Schemas.AccessoriesSchema,
    Services.AccessoryInstanceService,
    Schemas.AccessoryInstancesSchema,
);
export const AssetsController = new MainResource(
    config.routes.assets,
    Services.AssetService,
    Schemas.AssetsSchema,
);
export const CompaniesController = new MainResource(
    config.routes.companies,
    Services.CompanyService,
    Schemas.CompaniesSchema,
);
export const DepartmentsController = new MainResource(
    config.routes.departments,
    Services.DepartmentService,
    Schemas.DepartmentsSchema,
);
export const LicensesController = new InstanceMasterResource(
    config.routes.licenses,
    Services.LicenseService,
    Schemas.LicensesSchema,
    Services.LicenseInstanceService,
    Schemas.LicenseInstancesSchema,
);
export const LocationsController = new MainResource(
    config.routes.locations,
    Services.LocationService,
    Schemas.LocationsSchema,
);
export const UsersController = new MainResource(
    config.routes.users,
    Services.UserService,
    Schemas.UsersSchema,
);
