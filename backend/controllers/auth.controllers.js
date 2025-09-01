import { mongoose } from 'mongoose';
import User from '../models/user.models.js';
import generateToken from '../helpers/generateToken.js';

export async function register(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

        const dbUser = await User.findOne({ username });
        if (dbUser) return res.status(409).json({ message: 'Username already exists' });

        const _id = new mongoose.Types.ObjectId();
        const id = await User.findOne().sort({ _id: -1 }).exec() + 1;
        const user = new User({ _id, id, username, password });
        await user.save();

        const token = generateToken(_id);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

        const dbUser = await User.findOne({ username });
        if (!dbUser) return res.status(401).json({ error: 'Invalid credentials' });
        
        const isPasswordCorrect = await dbUser.checkPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ error: 'Invalid credentials' });

        const _id = dbUser._id;
        const token = generateToken(_id);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};