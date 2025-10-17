import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import isAdmin from '../lib/helpers/isAdmin.js';
import validateError from '../lib/helpers/validateError.js';

export default async function (req, res, next) {
    try {
        if (!isAdmin(req.user)) {
            throw new Error(ConstMessages.invalidPermissions);
        }
        next();
    } catch (err) {
        res.status(ConstCodes.forbidden).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
