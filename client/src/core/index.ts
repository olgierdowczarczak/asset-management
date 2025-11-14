import config from '@/config';
import * as Services from '@/services';
import * as Schemas from '@/schemas';
import MainResource from './controllers/MainResource';

export const AccessoriesController = new MainResource(
    config.routes.accessories,
    Services.AccessorieService,
    Schemas.accessoriesSchema,
);
export const AssetsController = new MainResource(
    config.routes.assets,
    Services.AssetService,
    Schemas.assetsSchema,
);
export const CompaniesController = new MainResource(
    config.routes.companies,
    Services.CompanyService,
    Schemas.companiesSchema,
);
export const DepartmentsController = new MainResource(
    config.routes.departments,
    Services.DepartmentService,
    Schemas.departmentsSchema,
);
export const LicensesController = new MainResource(
    config.routes.licenses,
    Services.LicenseService,
    Schemas.licensesSchema,
);
export const LocationsController = new MainResource(
    config.routes.locations,
    Services.LocationService,
    Schemas.locationsSchema,
);
export const UsersController = new MainResource(
    config.routes.users,
    Services.UserService,
    Schemas.usersSchema,
);
