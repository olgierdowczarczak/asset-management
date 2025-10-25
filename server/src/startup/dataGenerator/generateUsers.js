import { faker } from '@faker-js/faker';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import { ConstMessages, Logger } from 'asset-management-common/constants/index.js';
import { Users } from '../../lib/models/index.js';

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
    const lastId = await getLastDocument(Users);
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
        Logger.debug(`Generated: ${CHUNK_SIZE} users`);
    }
    Logger.debug(ConstMessages.generatedUsers);
};
