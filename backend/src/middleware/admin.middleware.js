import isAdmin from '../helpers/isAdmin.js';

export default async function (req, res, next) {
    try {
        if (!isAdmin(req.user)) throw new Error('Invalid permissions');

        next();
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
}
