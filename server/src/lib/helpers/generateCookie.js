/**
 * @param {Response} response
 * @param {String} name
 * @param {String} value
 * @param {Number} maxAge
 */
const generateCookie = (response, name, value, maxAge) => {
    response.cookie(name, value, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge,
    });
};

export default generateCookie;
