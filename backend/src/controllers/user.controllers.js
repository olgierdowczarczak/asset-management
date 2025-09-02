import { mongoose } from 'mongoose';
import User from '../models/user.models.js';

export async function getUser(req, res) {
    try {
        const params = req.params;
        const { _id } = params;
        const user = await User.findById(_id).select('-password');
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
        const { _id } = params;
        delete body._id;
        const conditions = Object.entries(body).map(([key, value]) => ({ [key]: value }));
        const dbUsers = await User.find({ $or: conditions });
        const dataExists = dbUsers.some(user => user._id !== _id);
        if (dataExists) return res.status(409).json({ message: 'User already exists' });

        const user = await User.findOneAndUpdate({ _id, is_deleted: false }, { $set: body }, {
            new: true,
            runValidators: true
        }).select('-password');

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
        const { _id } = params
        const user = await User.findById(_id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not exists' });
        if (user.is_admin) return res.status(409).json({ message: 'User can not be deleted' });
        if (user.is_deleted) return res.status(409).json({ message: 'User already deleted' });

        await user.updateOne({ is_deleted: true });
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getActiveUsers(req, res) {
    try {
        const body = req.body;
        const users = await User.find({ body, is_deleted: false }).select('-password');
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getAllUsers(req, res) {
    try {
        const body = req.body;
        const users = await User.find(body).select('-password');
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getDeletedUsers(req, res) {
    try {
        const body = req.body;
        const users = await User.find({ body, is_deleted: true }).select('-password');
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function createUser(req, res) {
    try {
        const body = req.body;
        const { username } = body;
        if (!username) return res.status(400).json({ message: 'Username is required' });

        const dbUser = await User.findOne({ username });
        if (dbUser) return res.status(409).json({ message: 'User already exists' });

        const _id = new mongoose.Types.ObjectId();
        const lastUser = await User.findOne().sort({ _id: -1 }).exec();
        const id = lastUser?.id + 1 || 1;
        const user = new User({ _id, id, username, ...body });
        await user.save();

        let userObj = user.toObject();
        if (userObj.password) delete userObj.password;

        res.status(201).send(userObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};