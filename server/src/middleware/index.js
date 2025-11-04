import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from '../config/index.js';

export default (app) => {
    app.use(express.json());
    app.use(
        cors({
            origin: config.ALLOWED_ADDRESS,
            credentials: true,
        }),
    );
    app.use(cookieParser());
};
