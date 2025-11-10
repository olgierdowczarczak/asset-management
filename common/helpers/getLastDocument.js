import ConstMessages from '../constants/constMessages.js';

const getLastDocument = async model => {
    try {
        const lastUser = await model.findOne().sort({ id: -1 });
        return lastUser ? lastUser.id + 1 : 1;
    } catch {
        throw new Error(ConstMessages.actionFailed);
    }
};

export default getLastDocument;
