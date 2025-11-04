import { EnvironmentNames } from 'asset-management-common/constants/index.js';
import config from '../../config/index.js';

/**
 * @param {Response} response
 * @param {String} name
 * @param {String} value
 * @param {Number} maxAge
 */
const generateCookie = (response, name, value, maxAge) => {
    response.cookie(name, value, {
        httpOnly: true,
        secure: config.ENVIRONMENT === EnvironmentNames.production,
        sameSite: 'strict',
        maxAge,
        path: '/',
    });
};

export default generateCookie;
