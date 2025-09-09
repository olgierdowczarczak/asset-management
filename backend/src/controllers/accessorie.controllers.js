import Accessorie from '../models/accessorie.models.js';

export async function getAccessorie(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const accessorie = await Accessorie.findOne({ id }).select('-_id');
        if (!accessorie) return res.status(404).json({ message: 'Accessorie not exists' });
        res.send(accessorie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateAccessorie(req, res) {
    try {
        const params = req.params;
        const body = req.body;
        const { id } = params;
        delete body._id;
        delete body.id;
        const accessorie = await Accessorie.findOneAndUpdate(
            { id },
            { $set: body },
            {
                new: true,
                runValidators: true,
            },
        ).select('-_id');

        if (!accessorie) return res.status(404).json({ message: 'Accessorie not exists' });
        res.send(accessorie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteAccessorie(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const accessorie = await Accessorie.findOne({ id });
        if (!accessorie) return res.status(404).json({ message: 'Accessorie not exists' });

        await Accessorie.deleteOne({ id });
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getAccessories(req, res) {
    try {
        const body = req.body;
        const accessories = await Accessorie.find(body).select('-_id');
        res.send(accessories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createAccessorie(req, res) {
    try {
        const body = req.body;
        const lastAccessorie = await Accessorie.findOne().sort({ id: -1 }).exec();
        const id = lastAccessorie?.id + 1 || 1;
        const accessorie = new Accessorie({ id, ...body });
        await accessorie.save();

        let accessorieObj = accessorie.toObject();
        delete accessorieObj._id;

        res.status(201).send(accessorieObj);
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
                return res.status(400).json({ errors });
            }

            default:
                return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
