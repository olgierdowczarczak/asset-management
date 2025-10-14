import ErrorCodes from 'asset-management-common/constants/errorCodes.js';
import ErrorMessages from 'asset-management-common/constants/errorMessages.js';

export default (error) => {
    console.error(error);

    switch (error.name) {
        case 'MongoServerError': {
            if (error.code === ErrorCodes.duplicatedField) {
                return ErrorMessages.duplicatedField;
            }
            return error.message || '';
        }
        case 'ValidationError': {
            const errors = Object.values(error.errors).map(e => e.message);
            return errors[0];
        }
    }

    return error.message || '';
};
