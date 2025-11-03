import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT | 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SALT = process.env.JWT_SALT;
const JWT_SECRET = process.env.JWT_SECRET;
const ALLOWED_ADDRESS = process.env.ALLOWED_ADDRESS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ENVIRONMENT = process.env.ENVIRONMENT;

const env = {
    PORT,
    MONGO_URI,
    JWT_SALT,
    JWT_SECRET,
    ALLOWED_ADDRESS,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ENVIRONMENT,
};

export default env;
