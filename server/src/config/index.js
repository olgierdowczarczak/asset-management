import { Logger } from 'asset-management-common/constants/index.js';
import env from './env.js';
import routes from './routes.js';

const config = {
    Logger,
    ...env,
    routes,
};

export default config;
