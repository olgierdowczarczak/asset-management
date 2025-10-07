import License from '../models/license.models.js';

const meta = {
    columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'quantity', label: 'Quantity', type: 'number' },
    ]
};

export async function getLicense(req, res) {
    try {
        const license = await License.findOne({ id: req.params.id });
        if (!license) {
            return res.status(404).json({ message: 'License not exists' });
        }

        res.json({ meta, total: 1, data: license.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function updateLicense(req, res) {
    try {
        const license = await License.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!license) {
            return res.status(404).json({ message: 'License not exists' });
        }

        res.json({ meta, total: 1, data: license.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function deleteLicense(req, res) {
    try {
        const license = await License.findOne({ id: req.params.id });
        if (!license) {
            return res.status(404).json({ message: 'License not exists' });
        }

        await license.hardDelete();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getLicenses(req, res) {
    try {
        const licenses = await License.find(req.body);
        res.json({ meta, total: licenses.length, data: licenses.map((license) => license.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function createLicense(req, res) {
    try {
        const license = new License(req.body);
        await license.save();
        res.status(201).json({ meta, total: 1, data: license.toPublic() });
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
