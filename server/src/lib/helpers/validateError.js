import Logger from 'asset-management-common/constants/logger.js';
import validateError from 'asset-management-common/helpers/validateError.js';

export default (err) => {
    console.log(err);
    const message = validateError(err);
    if (message) {
        Logger.error(message);
    }
    return message;
};
