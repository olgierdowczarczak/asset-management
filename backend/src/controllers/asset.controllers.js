import Asset from '../models/asset.models.js';

const meta = {
    columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Name', type: 'string' }
    ]
};

export async function getAsset(req, res) {
    try {
        const asset = await Asset.findOne({ id: req.params.id });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not exists' });
        }
        res.json({ meta, total: 1, data: asset.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function updateAsset(req, res) {
    try {
        const asset = await Asset.findOneAndUpdate(
            { id: req.params.id, isDeleted: false },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!asset) {
            return res.status(404).json({ message: 'Asset not exists' });
        }

        res.json({ meta, total: 1, data: asset.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function deleteAsset(req, res) {
    try {
        const asset = await Asset.findOne({ id: req.params.id });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not exists' });
        }

        await asset.softDelete();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getActiveAssets(req, res) {
    try {
        const assets = await Asset.find({
            isDeleted: { $ne: true },
            ...req.body,
        });
        res.json({ meta, total: assets.length, data: assets.map((asset) => asset.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getAllAssets(req, res) {
    try {
        const assets = await Asset.find(req.body);
        res.json({ meta, total: assets.length, data: assets.map((asset) => asset.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getDeletedAssets(req, res) {
    try {
        const assets = await Asset.find({ ...req.body, isDeleted: true });
        res.json({ meta, total: assets.length, data: assets.map((asset) => asset.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function createAsset(req, res) {
    try {
        const asset = new Asset(req.body);
        await asset.save();
        res.status(201).json({ meta, total: 1, data: asset.toPublic() });
    } catch (err) {
        console.error(err);
        switch (err.name) {
            case 'MongoServerError': {
                if (err.code === 11000) {
                    return res.status(400).json({
                        message: `Duplicate field: ${Object.keys(err.keyPattern).join(', ')}`,
                    });
                }
                return res.status(400).json({ message: err.message });
            }
            case 'MongooseError':
                return res.status(400).json({ message: err.message });
            case 'ValidationError': {
                const errors = Object.values(err.errors).map((e) => e.message);
                return res.status(400).json({ message: errors[0] });
            }
            default:
                return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
