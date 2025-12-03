import {
    ConstMessages,
    ConstantsValues,
    ErrorTypeConstants,
} from 'asset-management-common/constants/index.js';
import config from '../../config/index.js';

/**
 * @param {Error} error
 */
const handleErrorMessage = (error) => {
    switch (error.name) {
        case ErrorTypeConstants.mongoServerError: {
            if (error.code === ConstantsValues.duplicatedField) {
                return ConstMessages.duplicatedField;
            }
            return error.message || '';
        }
        case ErrorTypeConstants.validationError: {
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
        config.Logger.error(errorMessage);
    }

    return errorMessage;
};

export default validateError;
