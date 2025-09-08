export default async function (req, res, next) {
    try {
        const user = req.user;
        if (user.role !== 'admin') throw new Error('Invalid permissions');

        next();
    } catch (err) {
        return res.status(403).json({ message: err.message }); 
    }
};