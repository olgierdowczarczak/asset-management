import Location from '../models/location.models.js';

const meta = {
    columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Name', type: 'string' },
    ],
};

export async function getLocation(req, res) {
    try {
        const location = await Location.findOne({ id: req.params.id });
        if (!location) {
            return res.status(404).json({ message: 'Location not exists' });
        }

        res.json({ meta, total: 1, data: location.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function updateLocation(req, res) {
    try {
        const location = await Location.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!location) {
            return res.status(404).json({ message: 'Location not exists' });
        }

        res.json({ meta, total: 1, data: location.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function deleteLocation(req, res) {
    try {
        const location = await Location.findOne({ id: req.params.id });
        if (!location) {
            return res.status(404).json({ message: 'Location not exists' });
        }

        await location.hardDelete();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getLocations(req, res) {
    try {
        const locations = await Location.find(req.body);
        res.json({
            meta,
            total: locations.length,
            data: locations.map((location) => location.toPublic()),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function createLocation(req, res) {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json({ meta, total: 1, data: location.toPublic() });
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
