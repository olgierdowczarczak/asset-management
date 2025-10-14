import { faker } from '@faker-js/faker';
import User from '../../models/user.models.js';

const MAX_USER = 1000;
const CHUNK_SIZE = 100;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 31;

const generateUsername = (firstName, lastName) => {
    return `${firstName[0]}.${lastName}`.toLowerCase();
};

const generatePassword = () => {
    const length =
        Math.floor(Math.random() * (MAX_PASSWORD_LENGTH - MIN_PASSWORD_LENGTH + 1)) +
        MIN_PASSWORD_LENGTH;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};

const generateEmail = (firstName, lastName) => {
    return `${firstName[0]}.${lastName}@random.com`.toLowerCase();
};

export default async (environment) => {
    await new User({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD || 'zaq1@WSX',
        email: process.env.ADMIN_EMAIL || 'owczarczakdev@gmail.com',
        firstName: 'admin',
        lastName: 'admin',
        role: 'admin',
    }).save();

    if (environment !== 'dev') {
        return;
    }

    for (let i = 0; i < MAX_USER / CHUNK_SIZE; i++) {
        const users = [];
        for (let j = 0; j < CHUNK_SIZE; j++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            users.push({
                username: generateUsername(firstName, lastName),
                password: generatePassword(),
                email: generateEmail(firstName, lastName),
                firstName,
                lastName,
            });
        }

        await User.create(users);
        console.log(`Generated: ${CHUNK_SIZE} users`);
    }

    console.log('Generated users');
};
