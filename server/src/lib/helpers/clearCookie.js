import { EnvironmentNames, CookieConstants } from 'asset-management-common/constants/index.js';
import config from '../../config/index.js';

/**
 * @param {Response} response
 * @param {String} name
 */
const clearCookie = (response, name) => {
    const isLocalhost = config.ALLOWED_ADDRESS && config.ALLOWED_ADDRESS.includes('localhost');
    response.clearCookie(name, {
        httpOnly: true,
        secure: config.ENVIRONMENT === EnvironmentNames.production && !isLocalhost,
        sameSite: isLocalhost ? CookieConstants.sameSiteLax : CookieConstants.sameSiteStrict,
    });
};

export default clearCookie;
