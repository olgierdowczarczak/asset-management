import { EnvironmentNames } from 'asset-management-common/constants/index.js';
import config from '../../config/index.js';

/**
 * @param {Response} response
 * @param {String} name
 * @param {String} value
 * @param {Number} maxAge
 */
const generateCookie = (response, name, value, maxAge) => {
    const isLocalhost = config.ALLOWED_ADDRESS && config.ALLOWED_ADDRESS.includes('localhost');
    response.cookie(name, value, {
        httpOnly: true,
        secure: config.ENVIRONMENT === EnvironmentNames.production && !isLocalhost,
        sameSite: isLocalhost ? 'lax' : 'strict',
        maxAge,
        path: '/',
    });
};

export default generateCookie;
