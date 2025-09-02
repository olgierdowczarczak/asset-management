import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import authMiddleware from './middleware/auth.middleware.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/status', (req, res) => res.send('OK'));
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, usersRoutes);

// connections
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
    })
    .catch(err => console.error(err));