import { ConstMessages } from 'asset-management-common/constants/index.js';
import { Users } from '../lib/models/index.js';
import config from '../config/index.js';

export default async () => {
    const count = await Users.countDocuments({});
    if (!count) {
        const user = new Users({
            id: 1,
            username: ConstMessages.admin,
            password: config.ADMIN_PASSWORD,
            email: config.ADMIN_EMAIL,
            firstName: ConstMessages.admin,
            lastName: ConstMessages.admin,
            role: ConstMessages.admin,
        });
        user.save();
        config.Logger.debug(ConstMessages.adminAdded);
    }
};
