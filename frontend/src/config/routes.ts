const createRoutes = (base: string) => ({
    many: base,
    create: `${base}/create`,
    single: {
        get: `${base}/:id`,
        edit: `${base}/:id/edit`,
        delete: `${base}/:id/delete`,
    },
});

export default {
    home: '/',
    auth: {
        login: '/login',
        logout: '/logout',
    },
    accessories: createRoutes('/accessories'),
    assets: createRoutes('/assets'),
    licenses: createRoutes('/licenses'),
    users: createRoutes('/users'),
};
