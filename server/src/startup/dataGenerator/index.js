import GenerateUsers from './generateUsers.js';

export default async (environment) => [await GenerateUsers(environment)];
