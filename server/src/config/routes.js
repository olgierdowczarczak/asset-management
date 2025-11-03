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
    status: '/api/status',
    accessories: '/api/accessories',
    assets: '/api/assets',
    companies: '/api/companies',
    departments: '/api/departments',
    licenses: '/api/licenses',
    locations: '/api/locations',
    users: '/api/users',
};

export default routes;
