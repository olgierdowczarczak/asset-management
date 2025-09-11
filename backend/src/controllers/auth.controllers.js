import User from '../models/user.models.js';
import generateToken from '../helpers/generateToken.js';

export async function login(req, res) {
    try {
        const body = req.body;
        const { username, password } = body;
        if (!username || !password)
            return res.status(400).json({ message: 'Username and password are required' });

        const user = await User.findOne({ username }).select('+password');
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ message: 'Invalid credentials' });

        if (user.role !== 'admin') return res.status(403).json({ message: 'Invalid permissions' });

        const _id = user._id;
        const token = generateToken(_id);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function logout(req, res) {
    try {
        res.json({ message: 'OK' });
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
                return res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }
}
