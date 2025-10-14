import User from '../models/user.models.js';

export default async () => {
    const result = await User.countDocuments({});
    return !result;
};
