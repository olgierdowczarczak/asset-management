import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
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
app.use('/api/status', (req, res) => res.send('OK'));
app.use('/api/auth', Routes.AuthRoutes);
app.use('/api/accessories', Routes.AccessorieRoutes);
app.use('/api/assets', Routes.AssetRoutes);
app.use('/api/licenses', Routes.LicenseRoutes);
app.use('/api/location', Routes.LocationRoutes);
app.use('/api/company', Routes.CompanyRoutes);
app.use('/api/department', Routes.DepartmentRoutes);

// connections
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`App is running on port ${PORT}`));

        if ((await Startup.isInitialized()) || process.env.GENERATE_DATA) {
            await Startup.DataGenerator(process.env.ENVIRONMENT);
        }
    })
    .catch((err) => console.error(err));
