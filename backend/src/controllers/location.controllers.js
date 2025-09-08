import Location from '../models/location.models.js';

export async function getLocation(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const location = await Location.findOne({ id }).select('-_id');
        if (!location) return res.status(404).json({ message: 'Location not exists' });
        res.send(location);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function updateLocation(req, res) {
    try {
        const params = req.params;
        const body = req.body;
        const { id } = params;
        delete body._id;
        delete body.id;
        const location = await Location.findOneAndUpdate({ id }, { $set: body }, {
            new: true,
            runValidators: true
        }).select('-_id');

        if (!location) return res.status(404).json({ message: 'Location not exists' });
        res.send(location);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function deleteLocation(req, res) {
    try {
        const params = req.params;
        const { id } = params
        const location = await Location.findOne({ id });
        if (!location) return res.status(404).json({ message: 'Location not exists' });

        await Location.deleteOne({ id });
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getLocations(req, res) {
    try {
        const body = req.body;
        const locations = await Location.find(body).select('-_id');
        res.send(locations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function createLocation(req, res) {
    try {
        const body = req.body;
        const lastAsset = await Location.findOne().sort({ id: -1 }).exec();
        const id = lastAsset?.id + 1 || 1;
        const location = new Location({ id, ...body });
        await location.save();

        let locationObj = location.toObject();
        delete locationObj._id;

        res.status(201).send(locationObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};