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
    const expiresIn = isRemembered
        ? config.JWT_ACCESS_EXPIRY_REMEMBERED
        : config.JWT_ACCESS_EXPIRY_DEFAULT;
    return generateToken(id, expiresIn, config.JWT_SECRET);
};

/**
 * @param {any} id
 */
export const generateRefreshToken = (id) => {
    return generateToken(id, config.JWT_REFRESH_EXPIRY, config.JWT_REFRESH_SECRET);
};
