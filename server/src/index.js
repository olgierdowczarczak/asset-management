import dotenv from 'dotenv';
dotenv.config();

import ConstMessages from 'asset-management-common/constants/constMessages.js';
import Logger from 'asset-management-common/constants/logger.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Startup from './startup/index.js';
import Config from './config/index.js';
import Routes from './routes/index.js';
import authMiddleware from './middleware/auth.middleware.js';

const DEFAULT_PORT = 3000;
const app = express();

// middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use(Config.Routes.accessories, authMiddleware, Routes.AccessoriesRoutes);
app.use(Config.Routes.assets, authMiddleware, Routes.AssetsRoutes);
app.use(Config.Routes.auth, Routes.AuthRoutes);
app.use(Config.Routes.companies, authMiddleware, Routes.CompaniesRoutes);
app.use(Config.Routes.departments, authMiddleware, Routes.DepartmentsRoutes);
app.use(Config.Routes.licenses, authMiddleware, Routes.LicensesRoutes);
app.use(Config.Routes.locations, authMiddleware, Routes.LocationsRoutes);
app.use(Config.Routes.users, authMiddleware, Routes.UsersRoutes);

// connections
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        const PORT = process.env.PORT || DEFAULT_PORT;
        app.listen(PORT, () => Logger.info(`${ConstMessages.appIsRunning} ${PORT}`));

        if (
            (await Startup.isInitialized()) &&
            process.env.GENERATE_DATA === 'true' &&
            process.env.ENVIRONMENT == ConstMessages.dev
        ) {
            await Startup.DataGenerator(process.env.ENVIRONMENT);
        }
    })
    .catch((err) => Logger.error(err));
