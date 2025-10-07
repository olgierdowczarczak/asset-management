import User from '../models/user.models.js';

const meta = {
    columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'username', label: 'Username', type: 'string' },
        { key: 'email', label: 'Email', type: 'string' }
    ]
};

export async function getUser(req, res) {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not exists' });
        }

        res.json({ meta, total: 1, data: user.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function updateUser(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { id: req.params.id, isDeleted: false },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!user) {
            return res.status(404).json({ message: 'User not exists' });
        }

        res.json({ meta, total: 1, data: user.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function deleteUser(req, res) {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not exists' });
        }

        await user.softDelete();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getActiveUsers(req, res) {
    try {
        const users = await User.find({
            isDeleted: { $ne: true },
            ...req.body,
        });
        res.json({ meta, total: users.length, data: users.map((user) => user.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await User.find(req.body);
        res.json({ meta, total: users.length, data: users.map((user) => user.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getDeletedUsers(req, res) {
    try {
        const users = await User.find({ ...req.body, isDeleted: true });
        res.json({ meta, total: users.length, data: users.map((user) => user.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function createUser(req, res) {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ meta, total: 1, data: user.toPublic() });
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
