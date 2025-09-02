import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.models.js';

const handleAuthHeader = async (data) => {
    const authHeader = data;
    if (!authHeader) throw new Error('Authorization header missing or invalid');

    const token = authHeader.split(' ')[1];
    if (!token) throw new Error('Token missing');

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id username is_admin');
    if (!user) throw new Error('User not found');

    return user;
};

export default async function (req, res, next) {
    try {
        const user = await handleAuthHeader(req.headers['authorization']);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};