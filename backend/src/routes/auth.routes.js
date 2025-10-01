import { Router } from 'express';
import { login, logout, refresh, getMe } from '../controllers/auth.controllers.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', authMiddleware, refresh);
router.get('/me', authMiddleware, getMe);

export default router;
