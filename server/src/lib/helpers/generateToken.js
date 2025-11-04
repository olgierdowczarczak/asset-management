import jsonwebtoken from 'jsonwebtoken';
import config from '../../config/index.js';

/**
 * @param {any} id
 * @param {string} expiresIn
 * @param {string} key
 */
export const generateToken = (id, expiresIn, key = config.JWT_SECRET) => {
    return jsonwebtoken.sign({ id }, key, { expiresIn });
};

/**
 * @param {any} id
 * @param {boolean} isRemembered
 */
export const generateAccessToken = (id, isRemembered) => {
    return generateToken(id, isRemembered ? '30d' : '15m', config.JWT_SECRET);
};

/**
 * @param {any} id
 */
export const generateRefreshToken = (id) => {
    return generateToken(id, '7d', config.JWT_REFRESH_SECRET);
};
