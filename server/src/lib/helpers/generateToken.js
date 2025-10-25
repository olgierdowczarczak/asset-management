import jsonwebtoken from 'jsonwebtoken';

/**
 * @param {Object} user
 */
const generateToken = (user) => {
    const { id, isRemembered } = user;
    return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: isRemembered ? '30d' : '1h',
    });
};

export default generateToken;
