import bcrypt from 'bcrypt';

/**
 * @param {string} decrypted
 * @param {string} encrypted
 */
const compareData = async(decrypted, encrypted) => bcrypt.compare(decrypted, encrypted);

export default compareData;
