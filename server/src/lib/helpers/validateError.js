import Logger from 'asset-management-common/constants/logger.js';
import validateError from 'asset-management-common/helpers/validateError.js';

/**
 * @param {Error} error
 */
export default (error) => {
    console.log(error);
    const message = validateError(error);
    if (message) {
        Logger.error(message);
    }
    return message;
};
