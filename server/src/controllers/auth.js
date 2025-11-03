import { ConstMessages } from 'asset-management-common/constants/index.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import { Users } from '../lib/models/index.js';
import generateCookie from '../lib/helpers/generateCookie.js';
import generateToken from '../lib/helpers/generateToken.js';
import validateError from '../lib/helpers/validateError.js';
import authMiddleware from '../middleware/auth.middleware.js';
import config from '../config/index.js';

class Auth extends Endpoint {
    constructor() {
        super();
        this._router.post(config.routes.auth.endpoints.login, this.login);
        this._router.post(config.routes.auth.endpoints.logout, authMiddleware, this.logout);
        this._router.post(config.routes.auth.endpoints.refresh, authMiddleware, this.refresh);
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
                    .send(ConstMessages.usernameAndPasswordAreRequired);
            }
            const user = await Users.findOne({ username });
            if (!user) {
                return response.status(StatusCodes.NOT_FOUND).send(ConstMessages.notFound);
            }

            // const isPasswordCorrect = await user.checkPassword(password);
            // if (!isPasswordCorrect) {
            //     return response
            //         .status(StatusCodes.UNAUTHORIZED)
            //         .send(ConstMessages.invalidCredentials);
            // }
            if (user.role !== ConstMessages.admin) {
                return response
                    .status(StatusCodes.FORBIDDEN)
                    .send(ConstMessages.invalidPermissions);
            }
            const { _id, id, role } = user;
            if (isRemembered) {
                await Users.findOneAndUpdate(
                    { _id },
                    { $set: { isRemembered: true } },
                    { new: true, runValidators: true },
                );
                generateCookie(response, 'access_token', generateToken(user), 1);
            } else {
                generateCookie(response, 'access_token', generateToken(user), 1000000);
            }

            response.status(StatusCodes.OK).json({ id, username, role });
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
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
            response.clearCookie(ConstMessages.token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
            response.status(StatusCodes.OK).send(ConstMessages.actionSucceed);
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async refresh(request, response) {
        try {
            generateCookie(response, request.user);
            response.status(StatusCodes.OK).send(ConstMessages.actionSucceed);
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async getMe(request, response) {
        try {
            const { id, username, role } = request.user;
            response.status(StatusCodes.OK).json({ id, username, role });
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }
}

export default Auth;
