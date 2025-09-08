import User from '../models/user.models.js';

export async function getUser(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const user = await User.findOne({ id }).select('-_id -password ');
        if (!user) return res.status(404).json({ message: 'User not exists' });
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function updateUser(req, res) {
    try {
        const params = req.params;
        const body = req.body;
        const { id } = params;
        delete body._id;
        delete body.id;
        const user = await User.findOneAndUpdate({ id, isDeleted: false }, { $set: body }, {
            new: true,
            runValidators: true
        }).select('-_id -password ');

        if (!user) return res.status(404).json({ message: 'User not exists' });
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function deleteUser(req, res) {
    try {
        const params = req.params;
        const { id } = params
        const user = await User.findOne({ id }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not exists' });
        if (user.is_admin) return res.status(409).json({ message: 'User can not be deleted' });
        if (user.isDeleted) return res.status(409).json({ message: 'User already deleted' });

        user.isDeleted = true;
        await user.save();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getActiveUsers(req, res) {
    try {
        const body = req.body;
        const users = await User.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }], body }).select('-_id -password ');
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getAllUsers(req, res) {
    try {
        const body = req.body;
        const users = await User.find(body).select('-_id -password ');
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getDeletedUsers(req, res) {
    try {
        const body = req.body;
        const users = await User.find({ body, isDeleted: true }).select('-_id -password ');
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function createUser(req, res) {
    try {
        const body = req.body;
        const { username, password } = body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

        const dbUser = await User.findOne({ username });
        if (dbUser) return res.status(409).json({ message: 'User already exists' });

        const lastUser = await User.findOne().sort({ id: -1 }).exec();
        const id = lastUser?.id + 1 || 1;
        const user = new User({ id, username, ...body });
        await user.save();

        let userObj = user.toObject();
        delete userObj._id;
        if (userObj.password) delete userObj.password;

        res.status(201).send(userObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.errors });
    }
};