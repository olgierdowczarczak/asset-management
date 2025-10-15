import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import { Accessories } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getAccessories(req, res) {
    try {
        const accessories = await Accessories.find(req.body);

        res.status(ConstCodes.ok).send(accessories);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getAccessorie(req, res) {
    try {
        const { id } = req.params;
        const accessorie = await Accessories.findOne({ id });

        if (!accessorie) {
            return res.status(ConstCodes.notFound).send(ConstMessages.accessorieNotExists);
        }

        res.status(ConstCodes.ok).send(accessorie);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
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
            return res.status(ConstCodes.notFound).send(ConstMessages.accessorieNotExists);
        }

        res.status(ConstCodes.ok).send(accessorie);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function deleteAccessorie(req, res) {
    try {
        const { id } = req.params;
        const accessorie = await Accessories.findOne({ id });

        if (!accessorie) {
            return res.status(ConstCodes.notFound).send(ConstMessages.accessorieNotExists);
        }
        await Accessories.deleteOne({ id });

        res.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function createAccessorie(req, res) {
    try {
        const lastId = await getLastDocument(Accessories);
        const accessorie = new Accessories(req.body);
        accessorie.id = lastId;

        await accessorie.save();

        res.status(ConstCodes.created).send(accessorie);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
