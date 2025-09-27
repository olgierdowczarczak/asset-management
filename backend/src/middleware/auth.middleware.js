import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.models.js';

const handleAuthHeader = async (req) => {
    const token = req.cookies.token;
    if (!token) throw new Error('Token missing');

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id id username role');
    if (!user) throw new Error('User not found');

    return user;
};

export default async function (req, res, next) {
    try {
        const user = await handleAuthHeader(req);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}
