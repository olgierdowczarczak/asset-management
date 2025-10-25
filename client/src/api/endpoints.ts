const endpoints = {
    auth: {
        name: '/auth',
        paths: {
            login: '/login',
            logout: '/logout',
            getMe: '/me'
        }
    },
    accessorie: {
        name: 'accessories',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history'
        }
    },
    asset: {
        name: 'assets',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history'
        }
    },
    license: {
        name: 'licenses',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history'
        }
    },
    user: {
        name: 'users',
        paths: {
            getAll: '/',
            create: '/',
            get: '/:id/',
            edit: '/:id/',
            delete: '/:id/',
            history: '/:id/history'
        }
    }
};

export default endpoints;
