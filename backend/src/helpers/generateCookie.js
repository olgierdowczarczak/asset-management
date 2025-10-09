import generateToken from './generateToken.js';

export default function generateCookie(res, user) {
    res.cookie('token', generateToken(user), {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: user.isRemembered ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });
}
