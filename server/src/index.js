import { ConstMessages } from 'asset-management-common/constants/index.js';
import express from 'express';
import config from './config/index.js';
import injectMiddleware from './middleware/index.js';
import injectRoutes from './routes/index.js';
import injectConnections from './connections/index.js';
import startup from './startup/index.js';

const app = express();
injectMiddleware(app);
injectRoutes(app);
injectConnections()
    .then(async () => {
        app.listen(config.PORT, () =>
            config.Logger.info(`${ConstMessages.appIsRunning}: ${config.PORT}`),
        );
        await startup();
    })
    .catch((err) => config.Logger.error(err));
