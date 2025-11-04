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
const handleAuthHeader = async (request) => {
    const authorization = request.headers.authorization;
    if (!authorization) {
        throw new Error(ConstMessages.tokenMissing);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        throw new Error(ConstMessages.tokenMissing);
    }

    const decoded = jsonwebtoken.verify(token, config.JWT_SECRET);
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
        const user = await handleAuthHeader(request);
        request.user = user;
        next();
    } catch (err) {
        response
            .status(StatusCodes.UNAUTHORIZED)
            .send(validateError(err) || ConstMessages.internalServerError);
    }
}
