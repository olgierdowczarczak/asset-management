import config from '../config/index.js';
import * as Controllers from '../controllers/index.js';
import authMiddleware from '../middleware/auth.middleware.js';

export default (app) => {
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use(config.routes.auth.route, Controllers.auth.router);
    app.use(config.routes.accessories, authMiddleware, Controllers.accessories.router);
    app.use(config.routes.accessories, authMiddleware, Controllers.accessoryInstances.router);
    app.use(config.routes.assets, authMiddleware, Controllers.assets.router);
    app.use(config.routes.companies, authMiddleware, Controllers.companies.router);
    app.use(config.routes.departments, authMiddleware, Controllers.departments.router);
    app.use(config.routes.history, authMiddleware, Controllers.history.router);
    app.use(config.routes.jobtitles, authMiddleware, Controllers.jobtitles.router);
    app.use(config.routes.licenses, authMiddleware, Controllers.licenses.router);
    app.use(config.routes.licenses, authMiddleware, Controllers.licenseInstances.router);
    app.use(config.routes.locations, authMiddleware, Controllers.locations.router);
    app.use(config.routes.seniorities, authMiddleware, Controllers.seniorities.router);
    app.use(config.routes.users, authMiddleware, Controllers.users.router);
};
