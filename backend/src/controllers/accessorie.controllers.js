import Accessorie from '../models/accessorie.models.js';

const meta = {
    columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'quantity', label: 'Quantity', type: 'number' }
    ]
};

export async function getAccessorie(req, res) {
    try {
        const accessorie = await Accessorie.findOne({ id: req.params.id });
        if (!accessorie) {
            return res.status(404).json({ message: 'Accessorie not exists' });
        }

        res.json({ meta, total: 1, data: accessorie.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function updateAccessorie(req, res) {
    try {
        const accessorie = await Accessorie.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!accessorie) {
            return res.status(404).json({ message: 'Accessorie not exists' });
        }

        res.json({ meta, total: 1, data: accessorie.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function deleteAccessorie(req, res) {
    try {
        const accessorie = await Accessorie.findOne({ id: req.params.id });
        if (!accessorie) {
            return res.status(404).json({ message: 'Accessorie not exists' });
        }

        await accessorie.hardDelete();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getAccessories(req, res) {
    try {
        const accessories = await Accessorie.find(req.body);
        res.json({ meta, total: accessories.length, data: accessories.map((accessorie) => accessorie.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function createAccessorie(req, res) {
    try {
        const accessorie = new Accessorie(req.body);
        await accessorie.save();
        res.status(201).json({ meta, total: 1, data: accessorie.toPublic() });
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
