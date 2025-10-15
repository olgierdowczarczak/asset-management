import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import { Licenses } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getLicenses(req, res) {
    try {
        const licenses = await Licenses.find(req.body);

        res.status(ConstCodes.ok).send(licenses);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getLicense(req, res) {
    try {
        const { id } = req.params;
        const license = await Licenses.findOne({ id });

        if (!license) {
            return res.status(ConstCodes.notFound).send(ConstMessages.licenseNotExists);
        }

        res.status(ConstCodes.ok).send(license);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function updateLicense(req, res) {
    try {
        const { id } = req.params;
        const license = await Licenses.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!license) {
            return res.status(ConstCodes.notFound).send(ConstMessages.licenseNotExists);
        }

        res.status(ConstCodes.ok).send(license);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function deleteLicense(req, res) {
    try {
        const { id } = req.params;
        const license = await Licenses.findOne({ id });

        if (!license) {
            return res.status(ConstCodes.notFound).send(ConstMessages.licenseNotExists);
        }
        await Licenses.deleteOne({ id });

        res.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function createLicense(req, res) {
    try {
        const lastId = await getLastDocument(Licenses);
        const license = new Licenses(req.body);
        license.id = lastId;

        await license.save();

        res.status(ConstCodes.created).send(license);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
