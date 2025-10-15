import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import Constats from 'asset-management-common/constants/constats.js';
import jsonwebtoken from 'jsonwebtoken';
import { Users } from '../lib/collections/index.js';
import generateCookie from '../lib/helpers/generateCookie.js';
import validateError from '../lib/helpers/validateError.js';

const handleAuthHeader = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        throw new Error(ConstMessages.tokenMissing);
    }

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    if (!id) {
        throw new Error(ConstMessages.userNotExists);
    }

    const user = await Users.findOne({ id });
    if (!user) {
        throw new Error(ConstMessages.userNotExists);
    }

    const now = Math.floor(Date.now() / Constats.oneSecond);
    if (decoded.exp - now < Constats.tenSeconds) {
        generateCookie(res, user);
    }

    return user;
};

export default async function (req, res, next) {
    try {
        const user = await handleAuthHeader(req, res);
        req.user = user;
        next();
    } catch (err) {
        res.status(ConstCodes.unauthorized).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
