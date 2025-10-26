import { Logger, ConstMessages, ConstCodes } from 'asset-management-common/constants/index.js';

/**
 * @param {Error} error
 */
const handleErrorMessage = (error) => {
    switch (error.name) {
        case 'MongoServerError': {
            if (error.code === ConstCodes.duplicatedField) {
                return ConstMessages.duplicatedField;
            }
            return error.message || '';
        }
        case 'ValidationError': {
            const errors = Object.values(error.errors).map((e) => e.message);
            return errors[0];
        }
    }

    return error.message || '';
};

/**
 * @param {Error} error
 * @param {Boolean} printingError
 */
const validateError = (error, printingError = false) => {
    if (printingError) {
        console.error(error);
    }

    const errorMessage = handleErrorMessage(error);
    if (errorMessage) {
        Logger.error(errorMessage);
    }

    return errorMessage;
};

export default validateError;
