import { ConstMessages } from 'asset-management-common/constants/index.js';
import express from 'express';
import config from './config/index.js';
import incjectMiddleware from './middleware/index.js';
import incjectRoutes from './routes/index.js';
import incjectConnections from './connections/index.js';
import startup from './startup/index.js';

const app = express();
incjectMiddleware(app);
incjectRoutes(app);
incjectConnections()
    .then(async () => {
        app.listen(config.PORT, () =>
            config.Logger.info(`${ConstMessages.appIsRunning}: ${config.PORT}`),
        );
        await startup();
    })
    .catch((err) => config.Logger.error(err));
