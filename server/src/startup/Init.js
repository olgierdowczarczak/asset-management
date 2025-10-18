import ConstMessages from 'asset-management-common/constants/constMessages.js';
import Logger from 'asset-management-common/constants/logger.js';
import { Users } from '../lib/models/index.js';

export default async () => {
    const result = await Users.countDocuments({});
    if (!result) {
        await new Users({
            id: 1,
            username: ConstMessages.admin,
            password: process.env.ADMIN_PASSWORD,
            email: process.env.ADMIN_EMAIL,
            firstName: ConstMessages.admin,
            lastName: ConstMessages.admin,
            role: ConstMessages.admin,
        }).save();
        Logger.debug(ConstMessages.adminAdded);
    }
    return !result;
};
