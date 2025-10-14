import { Router } from 'express';
import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser,
} from '../controllers/users.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/').get(getUsers).post(adminMiddleware, createUser);

router
    .route('/:id')
    .get(getUser)
    .put(adminMiddleware, updateUser)
    .patch(adminMiddleware, updateUser)
    .delete(adminMiddleware, deleteUser);

export default router;
