import { auth } from '../controllers/index.js';
import authMiddleware from '../middleware/auth.middleware.js';

auth.router.post('/login', auth.login);
auth.router.post('/logout', authMiddleware, auth.logout);
auth.router.post('/refresh', authMiddleware, auth.refresh);
auth.router.get('/me', authMiddleware, auth.getMe);

export default auth.router;
