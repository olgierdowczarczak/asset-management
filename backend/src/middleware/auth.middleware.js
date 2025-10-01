import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.models.js';
import generateCookie from '../helpers/generateCookie.js';

const handleAuthHeader = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        throw new Error('Token missing');
    }

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    if (!id) {
        throw new Error('User not found');
    }

    const user = await User.findById(id).select('_id id username role');
    if (!user) {
        throw new Error('User not found');
    }

    const now = Math.floor(Date.now() / 1000);
    // 10 minutes
    if (decoded.exp - now < 600) {
        generateCookie(res, id);
    }

    return user;
};

export default async function (req, res, next) {
    try {
        const user = await handleAuthHeader(req, res);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}
