import { ConstMessages, ConstantsValues } from 'asset-management-common/constants/index.js';
import compareData from 'asset-management-common/helpers/compareData.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import config from '../config/index.js';
import { Users } from '../lib/models/index.js';
import authMiddleware from '../middleware/auth.middleware.js';
import refreshMiddleware from '../middleware/refresh.middleware.js';
import generateCookie from '../lib/helpers/generateCookie.js';
import clearCookie from '../lib/helpers/clearCookie.js';
import * as Token from '../lib/helpers/generateToken.js';
import validateError from '../lib/helpers/validateError.js';

class Auth extends Endpoint {
    constructor() {
        super();
        this._router.post(config.routes.auth.endpoints.login, this.login);
        this._router.post(config.routes.auth.endpoints.logout, authMiddleware, this.logout);
        this._router.post(config.routes.auth.endpoints.refresh, refreshMiddleware, this.refresh);
        this._router.get(config.routes.auth.endpoints.me, authMiddleware, this.getMe);
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async login(request, response) {
        try {
            const { username, password, isRemembered } = request.body;
            if (!username || !password) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: ConstMessages.usernameAndPasswordAreRequired });
            }
            const user = await Users.findOne({ username });
            if (!user) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            const isPasswordCorrect = await compareData(password, user.password);
            if (!isPasswordCorrect) {
                return response
                    .status(StatusCodes.UNAUTHORIZED)
                    .send({ message: ConstMessages.invalidCredentials });
            }

            const { _id } = user;
            const access_token = Token.generateAccessToken(_id, isRemembered);
            if (isRemembered) {
                await Users.findOneAndUpdate({ _id }, { $set: { isRemembered: true } });
            }

            generateCookie(
                response,
                ConstMessages.refreshToken,
                Token.generateRefreshToken(_id),
                ConstantsValues.thirtyDays,
            );

            const userResponse = user.toObject();
            delete userResponse.password;
            response.status(StatusCodes.OK).json({ user: userResponse, access_token });
        } catch (error) {
            const errorMessage = validateError(error) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async logout(request, response) {
        try {
            const { _id } = request.user;
            await Users.findOneAndUpdate({ _id }, { $unset: { isRemembered: '' } });
            clearCookie(response, ConstMessages.refreshToken);
            response.status(StatusCodes.OK).send({ message: ConstMessages.actionSucceed });
        } catch (error) {
            const errorMessage = validateError(error) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async refresh(request, response) {
        try {
            const { _id, isRemembered } = request.user;
            const access_token = Token.generateAccessToken(_id, isRemembered);
            generateCookie(
                response,
                ConstMessages.refreshToken,
                Token.generateRefreshToken(_id),
                ConstantsValues.thirtyDays,
            );
            response.status(StatusCodes.OK).json(access_token);
        } catch (error) {
            const errorMessage = validateError(error) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async getMe(request, response) {
        try {
            const userResponse = request.user.toObject
                ? request.user.toObject()
                : { ...request.user };
            delete userResponse.password;
            response.status(StatusCodes.OK).json(userResponse);
        } catch (error) {
            const errorMessage = validateError(error) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }
}

export default Auth;
