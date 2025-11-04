const endpoints = {
    auth: {
        name: '/auth',
        paths: {
            login: '/login',
            logout: '/logout',
            getMe: '/me',
            refresh: '/refresh'
        },
    },
    accessories: {
        name: 'accessories',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history',
            historyRecord: '/:id/history/:id',
        },
    },
    assets: {
        name: 'assets',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history',
            historyRecord: '/:id/history/:id',
        },
    },
    licenses: {
        name: 'licenses',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history',
            historyRecord: '/:id/history/:id',
        },
    },
    users: {
        name: 'users',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history',
            historyRecord: '/:id/history/:id',
        },
    },
};

export default endpoints;
