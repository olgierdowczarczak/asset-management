import { EnvironmentNames } from 'asset-management-common/constants/index.js';
import config from '../../config/index.js';

/**
 * @param {Response} response
 * @param {String} name
 */
const clearCookie = (response, name) => {
    response.clearCookie(name, {
        httpOnly: true,
        secure: config.ENVIRONMENT === EnvironmentNames.production,
        sameSite: 'strict',
    });
};

export default clearCookie;
