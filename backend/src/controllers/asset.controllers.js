import { mongoose } from 'mongoose';
import Asset from '../models/asset.models.js';

export async function getAsset(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const asset = await Asset.findOne({ id }).select('-_id');
        if (!asset) return res.status(404).json({ message: 'Asset not exists' });
        res.send(asset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function updateAsset(req, res) {
    try {
        const params = req.params;
        const body = req.body;
        const { id } = params;
        delete body._id;
        delete body.id;
        const asset = await Asset.findOneAndUpdate({ id, is_deleted: false }, { $set: body }, {
            new: true,
            runValidators: true
        }).select('-_id');

        if (!asset) return res.status(404).json({ message: 'Asset not exists' });
        res.send(asset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function deleteAsset(req, res) {
    try {
        const params = req.params;
        const { id } = params
        const asset = await Asset.findOne({ id });
        if (!asset) return res.status(404).json({ message: 'Asset not exists' });
        if (asset.is_deleted) return res.status(409).json({ message: 'Asset already deleted' });

        asset.is_deleted = true;
        await asset.save();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getActiveAssets(req, res) {
    try {
        const body = req.body;
        const assets = await Asset.find({ $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }], body }).select('-_id');
        res.send(assets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getAllAssets(req, res) {
    try {
        const body = req.body;
        const assets = await Asset.find(body).select('-_id');
        res.send(assets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getDeletedAssets(req, res) {
    try {
        const body = req.body;
        const assets = await Asset.find({ body, is_deleted: true }).select('-_id');
        res.send(assets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function createAsset(req, res) {
    try {
        const body = req.body;
        const _id = new mongoose.Types.ObjectId();
        const lastAsset = await Asset.findOne().sort({ id: -1 }).exec();
        const id = lastAsset?.id + 1 || 1;
        const asset = new Asset({ _id, id, ...body });
        await asset.save();

        let assetObj = asset.toObject();
        delete assetObj._id;

        res.status(201).send(assetObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};