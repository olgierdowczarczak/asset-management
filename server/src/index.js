import dotenv from 'dotenv';
dotenv.config();

import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Config from './config/index.js';
import Startup from './startup/index.js';
import Routes from './routes/index.js';

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
app.use(Config.Routes.status, (req, res) =>
    res.json(ConstCodes.ok).send(ConstMessages.actionSucceed),
);
app.use(Config.Routes.auth, Routes.AuthRoutes);
app.use(Config.Routes.accessories, Routes.AccessoriesRoutes);
app.use(Config.Routes.assets, Routes.AssetsRoutes);
app.use(Config.Routes.companies, Routes.CompaniesRoutes);
app.use(Config.Routes.departments, Routes.DepartmentsRoutes);
app.use(Config.Routes.licenses, Routes.LicensesRoutes);
app.use(Config.Routes.locations, Routes.LocationsRoutes);
app.use(Config.Routes.users, Routes.UsersRoutes);

// connections
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(ConstMessages.appIsRunning, PORT));

        if (
            (await Startup.isInitialized()) &&
            process.env.GENERATE_DATA === 'true' &&
            process.env.ENVIRONMENT == ConstMessages.dev
        ) {
            await Startup.DataGenerator(process.env.ENVIRONMENT);
        }
    })
    .catch((err) => console.error(err));
