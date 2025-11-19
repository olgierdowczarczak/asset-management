import { ConstMessages } from 'asset-management-common/constants/index.js';
import jsonwebtoken from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { Users } from '../lib/models/index.js';
import validateError from '../lib/helpers/validateError.js';
import config from '../config/index.js';

/**
 * @param {Request} request
 * @param {Response} response
 */
const handleAuthCookie = async (request) => {
    const token = request.cookies[ConstMessages.refreshToken];
    if (!token) {
        throw new Error(ConstMessages.tokenMissing);
    }

    const decoded = jsonwebtoken.verify(token, config.JWT_REFRESH_SECRET);
    const { id } = decoded;
    if (!id) {
        throw new Error(ConstMessages.notExists);
    }

    const user = await Users.findOne({ _id: id });
    if (!user) {
        throw new Error(ConstMessages.notExists);
    }

    return user;
};

/**
 * @param {Request} request
 * @param {Response} response
 * @param {Function} next
 */
export default async function (request, response, next) {
    try {
        const user = await handleAuthCookie(request);
        request.user = user;
        next();
    } catch (err) {
        const errorMessage = validateError(err) || ConstMessages.internalServerError;
        response.status(StatusCodes.UNAUTHORIZED).send({ message: errorMessage });
    }
}
