import generateToken from './generateToken.js';

export default function generateCookie(res, userId) {
    res.cookie('token', generateToken(userId), {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    });
}
