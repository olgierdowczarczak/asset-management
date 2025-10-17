import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { login, logout, refresh, getMe } from '../controllers/auth.controllers.js';

const router = Router();
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', authMiddleware, refresh);
router.get('/me', authMiddleware, getMe);

export default router;
