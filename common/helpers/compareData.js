import bcrypt from 'bcrypt';

/**
 * @param {string} encypted
 * @param {string} decrypted
 */
const compareData = async(decrypted, encrypted) => bcrypt.compare(decrypted, encrypted);

export default compareData;
