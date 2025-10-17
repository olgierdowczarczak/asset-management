import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import { Users } from '../lib/collections/index.js';
import generateCookie from '../lib/helpers/generateCookie.js';
import validateError from '../lib/helpers/validateError.js';

export async function login(req, res) {
    try {
        const { username, password, isRemembered } = req.body;

        if (!username || !password) {
            return res
                .status(ConstCodes.badRequest)
                .send(ConstMessages.usernameAndPasswordAreRequired);
        }
        const user = await Users.findOne({ username });
        if (!user) {
            return res.status(ConstCodes.notFound).send(ConstMessages.notFound);
        }
        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) {
            return res.status(ConstCodes.unauthorized).send(ConstMessages.invalidCredentials);
        }
        if (user.role !== ConstMessages.admin) {
            return res.status(ConstCodes.forbidden).send(ConstMessages.invalidPermissions);
        }
        const { _id, id, role } = user;
        if (isRemembered) {
            await Users.findOneAndUpdate(
                { _id },
                { $set: { isRemembered: true } },
                { new: true, runValidators: true },
            ).then((user) => generateCookie(res, user));
        } else {
            generateCookie(res, user);
        }

        res.status(ConstCodes.ok).json({ id, username, role });
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function logout(req, res) {
    try {
        const { _id } = req.user;
        await Users.findOneAndUpdate({ _id }, { $unset: { isRemembered: '' } });
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        res.status(ConstCodes.ok).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function refresh(req, res) {
    try {
        generateCookie(res, req.user);

        res.status(ConstCodes.ok).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getMe(req, res) {
    try {
        const { id, username, role } = req.user;

        res.status(ConstCodes.ok).json({ id, username, role });
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
