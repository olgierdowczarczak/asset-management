import { Router } from 'express';
import {
    getUser,
    updateUser,
    deleteUser,
    getActiveUsers,
    getAllUsers,
    getDeletedUsers,
    createUser,
} from '../controllers/user.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/').get(getActiveUsers).post(adminMiddleware, createUser);

router.get('/all', adminMiddleware, getAllUsers);
router.get('/deleted', adminMiddleware, getDeletedUsers);
router
    .route('/:id')
    .get(getUser)
    .put(adminMiddleware, updateUser)
    .patch(adminMiddleware, updateUser)
    .delete(adminMiddleware, deleteUser);

export default router;
