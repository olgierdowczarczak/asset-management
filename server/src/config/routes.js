import { CollectionNames } from 'asset-management-common/constants/index.js';

const routes = {
    auth: {
        route: '/api/auth',
        endpoints: {
            login: '/login',
            logout: '/logout',
            refresh: '/refresh',
            me: '/me',
        },
    },
    accessories: `/api/${CollectionNames.accessories}`,
    assets: `/api/${CollectionNames.assets}`,
    companies: `/api/${CollectionNames.companies}`,
    departments: `/api/${CollectionNames.departments}`,
    history: `/api/${CollectionNames.history}`,
    jobtitles: `/api/${CollectionNames.jobtitles}`,
    licenses: `/api/${CollectionNames.licenses}`,
    locations: `/api/${CollectionNames.locations}`,
    seniorities: `/api/${CollectionNames.seniorities}`,
    users: `/api/${CollectionNames.users}`,
};

export default routes;
