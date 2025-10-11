import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Startup from './startup/index.js';
import Routes from './routes/index.js';
import authMiddleware from './middleware/auth.middleware.js';

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
app.use('/api/accessories', authMiddleware, Routes.AccessorieRoutes);
app.use('/api/assets', authMiddleware, Routes.AssetRoutes);
app.use('/api/licenses', authMiddleware, Routes.LicenseRoutes);
app.use('/api/location', authMiddleware, Routes.LocationRoutes);
app.use('/api/company', authMiddleware, Routes.CompanyRoutes);
app.use('/api/department', authMiddleware, Routes.DepartmentRoutes);

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
