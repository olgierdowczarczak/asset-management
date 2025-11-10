import connectMongo from './mongo.js';

export default async () => {
    await connectMongo();
};
