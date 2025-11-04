import bcrypt from 'bcrypt';

/**
 * @param {string} data
 */
const encryptData = async data => bcrypt.hash(data, process.env.JWT_SALT);

export default encryptData;
