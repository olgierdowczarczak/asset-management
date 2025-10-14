import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import { Users } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getUsers(req, res) {
    try {
        const users = await Users.find(req.body);

        res.status(ConstCodes.ok).send(users);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getUser(req, res) {
    try {
        const { id } = req.params;
        const user = await Users.findOne({ id });

        if (!user) {
            return res.status(ConstCodes.notFound).send(ConstMessages.userNotExists);
        }

        res.status(ConstCodes.ok).send(user);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const user = await Users.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!user) {
            return res.status(ConstCodes.notFound).send(ConstMessages.userNotExists);
        }

        res.status(ConstCodes.ok).send(user);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await Users.findOne({ id });

        if (!user) {
            return res.status(ConstCodes.notFound).send(ConstMessages.userNotExists);
        }
        await Users.deleteOne({ id });

        res.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function createUser(req, res) {
    try {
        const user = new Users(req.body);

        await user.save();

        res.status(ConstCodes.created).send(user);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
