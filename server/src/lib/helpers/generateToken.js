import jsonwebtoken from 'jsonwebtoken';
import config from '../../config/index.js';

/**
 * @param {any} id
 * @param {string} expiresIn
 * @param {string} key
 */
export const generateToken = (id, expiresIn, key=config.JWT_SECRET) => {
    return jsonwebtoken.sign({ id }, key, { expiresIn });
};

/**
 * @param {any} id
 */
export const generateAccessToken = (id) => {
    return generateToken(id, '15m', config.JWT_SECRET);
}

/**
 * @param {any} id
 * @param {boolean} isRemembered
 */
export const generateRefreshToken = (id, isRemembered) => {
    return generateToken(id, isRemembered ? '30d' : '7d', config.JWT_REFRESH_SECRET);
}