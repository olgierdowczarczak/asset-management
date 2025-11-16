const endpoints = {
    auth: {
        name: '/auth',
        endpoints: {
            login: '/login',
            logout: '/logout',
            refresh: '/refresh',
            getMe: '/me',
        },
    },
    accessories: '/accessories',
    assets: '/assets',
    companies: '/companies',
    departments: '/departments',
    licenses: '/licenses',
    locations: '/locations',
    users: '/users',
    resource: {
        getAll: '/',
        create: '/',
        get: '/:id/',
        edit: '/:id/',
        delete: '/:id/',
        history: '/:id/history',
        historyRecord: '/:id/history/:recordId',
    },
};

export default endpoints;
