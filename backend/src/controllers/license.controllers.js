import License from '../models/license.models.js';

export async function getLicense(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const license = await License.findOne({ id }).select('-_id');
        if (!license) return res.status(404).json({ message: 'License not exists' });
        res.send(license);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateLicense(req, res) {
    try {
        const params = req.params;
        const body = req.body;
        const { id } = params;
        delete body._id;
        delete body.id;
        const license = await License.findOneAndUpdate(
            { id },
            { $set: body },
            {
                new: true,
                runValidators: true,
            },
        ).select('-_id');

        if (!license) return res.status(404).json({ message: 'License not exists' });
        res.send(license);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteLicense(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const license = await License.findOne({ id });
        if (!license) return res.status(404).json({ message: 'License not exists' });

        await License.deleteOne({ id });
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getLicenses(req, res) {
    try {
        const body = req.body;
        const licenses = await License.find(body).select('-_id');
        res.send(licenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createLicense(req, res) {
    try {
        const body = req.body;
        const lastLicense = await License.findOne().sort({ id: -1 }).exec();
        const id = lastLicense?.id + 1 || 1;
        const license = new License({ id, ...body });
        await license.save();

        let licenseObj = license.toObject();
        delete licenseObj._id;

        res.status(201).send(licenseObj);
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
