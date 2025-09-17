import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import accessorieRoutes from './routes/accessorie.routes.js';
import assetRoutes from './routes/asset.routes.js';
import licenseRoutes from './routes/license.routes.js';
import locationRoutes from './routes/location.routes.js';
import companyRoutes from './routes/company.routes.js';
import departmentRoutes from './routes/department.routes.js';
import authMiddleware from './middleware/auth.middleware.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/status', (req, res) => res.send('OK'));
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/accessories', authMiddleware, accessorieRoutes);
app.use('/api/assets', authMiddleware, assetRoutes);
app.use('/api/licenses', authMiddleware, licenseRoutes);
app.use('/api/location', authMiddleware, locationRoutes);
app.use('/api/company', authMiddleware, companyRoutes);
app.use('/api/department', authMiddleware, departmentRoutes);

// connections
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
    })
    .catch((err) => console.error(err));
