import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import { Locations } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getLocations(req, res) {
    try {
        const locations = await Locations.find(req.body);

        res.status(ConstCodes.ok).send(locations);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getLocation(req, res) {
    try {
        const { id } = req.params;
        const location = await Locations.findOne({ id });

        if (!location) {
            return res.status(ConstCodes.notFound).send(ConstMessages.locationNotExists);
        }

        res.status(ConstCodes.ok).send(location);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function updateLocation(req, res) {
    try {
        const { id } = req.params;
        const location = await Locations.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!location) {
            return res.status(ConstCodes.notFound).send(ConstMessages.locationNotExists);
        }

        res.status(ConstCodes.ok).send(location);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function deleteLocation(req, res) {
    try {
        const { id } = req.params;
        const location = await Locations.findOne({ id });

        if (!location) {
            return res.status(ConstCodes.notFound).send(ConstMessages.locationNotExists);
        }
        await Locations.deleteOne({ id });

        res.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function createLocation(req, res) {
    try {
        const lastId = await getLastDocument(Locations);
        const location = new Locations(req.body);
        location.id = lastId;

        await location.save();

        res.status(ConstCodes.created).send(location);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
