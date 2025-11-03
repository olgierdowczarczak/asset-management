import jsonwebtoken from 'jsonwebtoken';
import config from '../../config/index.js';

/**
 * @param {Object} user
 */
const generateToken = (user) => {
    const { id, isRemembered } = user;
    return jsonwebtoken.sign({ id }, config.JWT_SECRET, {
        expiresIn: isRemembered ? '30d' : '1h',
    });
};

export default generateToken;
