import generateToken from './generateToken.js';

/**
 * @param {Response} response
 * @param {Object} user
 */
export default (response, user) => {
    response.cookie('token', generateToken(user), {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: user.isRemembered ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });
};
