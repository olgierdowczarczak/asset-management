import ConstMessages from '../constants/constMessages.js';

export default async(model) => {
    try {
        const lastUser = await model.findOne().sort({ id: -1 });
        return lastUser ? lastUser.id + 1 : 1;
    } catch {
        throw new Error(ConstMessages.actionFailed);
    }
};
