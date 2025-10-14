import ConstMessages from 'asset-management-common/constants/constMessages.js';
import { faker } from '@faker-js/faker';
import { Users } from '../../lib/collections/index.js';

const MAX_USER = 1000;
const CHUNK_SIZE = 100;
const MIN_PASSWORD_LENGTH = 12;

const generateUsername = (firstName, lastName) => {
    return `${firstName[0]}.${lastName}`.toLowerCase();
};

const generateEmail = (firstName, lastName) => {
    return `${firstName[0]}.${lastName}@random.com`.toLowerCase();
};

export default async () => {
    const lastId = async () => {
        const lastUser = await Users.findOne().sort({ id: -1 });
        return lastUser.id || 1;
    };

    let id = await lastId();
    for (let i = 0; i < MAX_USER / CHUNK_SIZE; i++) {
        const users = [];
        for (let j = 0; j < CHUNK_SIZE; j++) {
            ++id;
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            users.push({
                id,
                username: generateUsername(firstName, lastName),
                password: faker.internet.password({ length: MIN_PASSWORD_LENGTH }),
                email: generateEmail(firstName, lastName),
                firstName,
                lastName,
            });
        }

        await Users.create(users);
        console.log(`Generated: ${CHUNK_SIZE} users`);
    }

    console.log(ConstMessages.generatedUsers);
};
