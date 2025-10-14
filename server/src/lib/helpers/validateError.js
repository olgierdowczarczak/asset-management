import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';

export default (error) => {
    console.error(error);

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
