import ConstMessages from '../constants/constMessages.js';
import ConstCodes from '../constants/constCodes.js';

export default (error) => {
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
