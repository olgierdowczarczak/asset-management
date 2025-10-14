import ErrorCodes from 'asset-management-common/constants/errorCodes.js';
import ErrorMessages from 'asset-management-common/constants/errorMessages.js';
import { Accessories } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getAccessorie(req, res) {
    try {
        const { id } = req.params;
        const accessorie = await Accessories.findOne({ id });

        if (!accessorie) {
            return res.status(ErrorCodes.notFound).send(ErrorMessages.accessorieNotExists);
        }

        res.send(accessorie);
    } catch (err) {
        res.status(ErrorCodes.badRequest).send(validateError(err) || ErrorMessages.internalServerError);
    }
}

export async function getAccessories(req, res) {
    try {
        const accessories = await Accessories.find(req.body);

        res.send(accessories);
    } catch (err) {
        res.status(ErrorCodes.badRequest).send(validateError(err) || ErrorMessages.internalServerError);
    }
}

export async function updateAccessorie(req, res) {
    try {
        const { id } = req.params;
        const accessorie = await Accessories.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!accessorie) {
            return res.status(ErrorCodes.notFound).send(ErrorMessages.accessorieNotExists);
        }

        res.send(accessorie);
    } catch (err) {
        res.status(ErrorCodes.badRequest).send(validateError(err) || ErrorMessages.internalServerError);
    }
}

export async function deleteAccessorie(req, res) {
    try {
        const { id } = req.params;
        const accessorie = await Accessories.findOne({ id });

        if (!accessorie) {
            return res.status(ErrorCodes.notFound).send(ErrorMessages.accessorieNotExists);
        }
        await Accessories.deleteOne({ id });

        res.status(ErrorCodes.deleted).send(ErrorMessages.actionSucceed);
    } catch (err) {
        res.status(ErrorCodes.badRequest).send(validateError(err) || ErrorMessages.internalServerError);
    }
}

export async function createAccessorie(req, res) {
    try {
        const accessorie = new Accessories(req.body);

        await accessorie.save();

        res.status(ErrorCodes.created).send(accessorie);
    } catch (err) {
        res.status(ErrorCodes.badRequest).send(validateError(err) || ErrorMessages.internalServerError);
    }
}
