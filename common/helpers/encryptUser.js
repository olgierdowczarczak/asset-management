import bcrypt from 'bcrypt';

export default async(user) => {
    user.password = await bcrypt.hash(user.password, Number(process.env.JWT_SALT));
    return user;
};
