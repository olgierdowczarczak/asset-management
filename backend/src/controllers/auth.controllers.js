import { mongoose } from 'mongoose';
import User from '../models/user.models.js';
import generateToken from '../helpers/generateToken.js';

export async function register(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

        const dbUser = await User.findOne({ username });
        if (dbUser) return res.status(409).json({ message: 'User already exists' });

        const _id = new mongoose.Types.ObjectId();
        const lastUser = await User.findOne().sort({ _id: -1 }).exec();
        const id = lastUser?.id + 1 || 1;
        const user = new User({ _id, id, username, password });
        await user.save();

        const token = generateToken(_id);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

        const dbUser = await User.findOne({ username });
        if (!dbUser) return res.status(401).json({ message: 'Invalid credentials' });

        if (dbUser.password) {
            const isPasswordCorrect = await dbUser.checkPassword(password);
            if (!isPasswordCorrect) return res.status(401).json({ message: 'Invalid credentials' });
        } else return res.status(403).json({ message: 'Invalid permissions' });

        const _id = dbUser._id;
        const token = generateToken(_id);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function logout(req, res) {
    try {
        res.json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};