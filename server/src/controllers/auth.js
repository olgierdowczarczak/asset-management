import { ConstMessages, ConstCodes } from 'asset-management-common/constants/index.js';
import Endpoint from './endpoint.js';
import { Users } from '../lib/models/index.js';
import generateCookie from '../lib/helpers/generateCookie.js';
import validateError from '../lib/helpers/validateError.js';

class Auth extends Endpoint {
    /**
     * @param {Request} request
     * @param {Response} response
     */
    async login(request, response) {
        try {
            const { username, password, isRemembered } = request.body;

            if (!username || !password) {
                return response
                    .status(ConstCodes.badRequest)
                    .send(ConstMessages.usernameAndPasswordAreRequired);
            }
            const user = await Users.findOne({ username });
            if (!user) {
                return response.status(ConstCodes.notFound).send(ConstMessages.notFound);
            }
            const isPasswordCorrect = await user.checkPassword(password);
            if (!isPasswordCorrect) {
                return response
                    .status(ConstCodes.unauthorized)
                    .send(ConstMessages.invalidCredentials);
            }
            if (user.role !== ConstMessages.admin) {
                return response.status(ConstCodes.forbidden).send(ConstMessages.invalidPermissions);
            }
            const { _id, id, role } = user;
            if (isRemembered) {
                await Users.findOneAndUpdate(
                    { _id },
                    { $set: { isRemembered: true } },
                    { new: true, runValidators: true },
                ).then((user) => generateCookie(response, user));
            } else {
                generateCookie(response, user);
            }

            response.status(ConstCodes.ok).json({ id, username, role });
        } catch (error) {
            response
                .status(ConstCodes.badRequest)
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

            response.status(ConstCodes.ok).send(ConstMessages.actionSucceed);
        } catch (error) {
            response
                .status(ConstCodes.badRequest)
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

            response.status(ConstCodes.ok).send(ConstMessages.actionSucceed);
        } catch (error) {
            response
                .status(ConstCodes.badRequest)
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

            response.status(ConstCodes.ok).json({ id, username, role });
        } catch (error) {
            response
                .status(ConstCodes.badRequest)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }
}

export default Auth;
