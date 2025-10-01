import jsonwebtoken from 'jsonwebtoken';

export default function generateToken(userId) {
    return jsonwebtoken.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
}
