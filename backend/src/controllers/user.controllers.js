import User from '../models/user.models.js';
import isAdmin from '../helpers/isAdmin.js';

export async function getUser(req, res) {
    try {
        const user = await User.findOne({ id: req.params.id }).select('-_id');
        if (!user) {
            return res.status(404).json({ message: 'User not exists' });
        }

        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateUser(req, res) {
    try {
        const body = req.body;
        delete body._id;
        delete body.id;

        const user = await User.findOneAndUpdate(
            { id: req.params.id, isDeleted: false },
            { $set: body },
            { new: true, runValidators: true },
        ).select('-_id');

        if (!user) {
            return res.status(404).json({ message: 'User not exists' });
        }

        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteUser(req, res) {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not exists' });
        }
        if (isAdmin(user)) {
            return res.status(409).json({ message: 'User can not be deleted' });
        }
        if (user.isDeleted) {
            return res.status(409).json({ message: 'User already deleted' });
        }

        user.isDeleted = true;
        await user.save();

        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getActiveUsers(req, res) {
    try {
        const users = await User.find({
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
            ...req.body,
        }).select('-_id');
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await User.find(req.body).select('-_id');
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getDeletedUsers(req, res) {
    try {
        const users = await User.find({ ...req.body, isDeleted: true }).select('-_id');
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createUser(req, res) {
    try {
        const last = await User.findOne().sort({ id: -1 }).exec();
        const id = last?.id + 1 || 1;
        const user = new User({
            id,
            ...req.body,
        });

        await user.save();

        const userObj = user.toObject();
        delete userObj._id;
        delete userObj.password;

        res.status(201).send(userObj);
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
