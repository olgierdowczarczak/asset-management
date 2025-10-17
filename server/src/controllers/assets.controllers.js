import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import { Assets } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getAssets(req, res) {
    try {
        const assets = await Assets.find(req.body);

        res.status(ConstCodes.ok).send(assets);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getAsset(req, res) {
    try {
        const { id } = req.params;
        const asset = await Assets.findOne({ id });

        if (!asset) {
            return res.status(ConstCodes.notFound).send(ConstMessages.assetNotExists);
        }

        res.status(ConstCodes.ok).send(asset);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function updateAsset(req, res) {
    try {
        const { id } = req.params;
        const asset = await Assets.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!asset) {
            return res.status(ConstCodes.notFound).send(ConstMessages.assetNotExists);
        }

        res.status(ConstCodes.ok).send(asset);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function deleteAsset(req, res) {
    try {
        const { id } = req.params;
        const asset = await Assets.findOne({ id });

        if (!asset) {
            return res.status(ConstCodes.notFound).send(ConstMessages.assetNotExists);
        }
        await Assets.deleteOne({ id });

        res.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function createAsset(req, res) {
    try {
        const lastId = await getLastDocument(Assets);
        const asset = new Assets(req.body);
        asset.id = lastId;

        await asset.save();

        res.status(ConstCodes.created).send(asset);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
