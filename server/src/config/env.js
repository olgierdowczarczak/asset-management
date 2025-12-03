import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SALT = parseInt(process.env.JWT_SALT) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRY_REMEMBERED = process.env.JWT_ACCESS_EXPIRY_REMEMBERED || '30d';
const JWT_ACCESS_EXPIRY_DEFAULT = process.env.JWT_ACCESS_EXPIRY_DEFAULT || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
const ALLOWED_ADDRESS = process.env.ALLOWED_ADDRESS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ENVIRONMENT = process.env.ENVIRONMENT;
const PAGINATION_DEFAULT_LIMIT = parseInt(process.env.PAGINATION_DEFAULT_LIMIT) || 10;
const PAGINATION_MAX_LIMIT = parseInt(process.env.PAGINATION_MAX_LIMIT) || 100;
const ADMIN_USER_ID = parseInt(process.env.ADMIN_USER_ID) || 1;

if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required');
}

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

if (!ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL environment variable is required');
}

if (!ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable is required');
}

const env = {
    PORT,
    MONGO_URI,
    JWT_SALT,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRY_REMEMBERED,
    JWT_ACCESS_EXPIRY_DEFAULT,
    JWT_REFRESH_EXPIRY,
    ALLOWED_ADDRESS,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ENVIRONMENT,
    PAGINATION_DEFAULT_LIMIT,
    PAGINATION_MAX_LIMIT,
    ADMIN_USER_ID,
};

export default env;
