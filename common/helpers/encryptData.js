import bcrypt from 'bcrypt';

/**
 * @param {string} data
 */
const encryptData = async data => bcrypt.hash(data, 10);

export default encryptData;
