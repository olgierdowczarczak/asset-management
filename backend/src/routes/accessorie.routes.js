import { Router } from 'express';
import {
    getAccessorie,
    updateAccessorie,
    deleteAccessorie,
    getAccessories,
    createAccessorie,
} from '../controllers/accessorie.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/').get(getAccessories).post(adminMiddleware, createAccessorie);

router
    .route('/:id')
    .get(getAccessorie)
    .put(adminMiddleware, updateAccessorie)
    .patch(adminMiddleware, updateAccessorie)
    .delete(adminMiddleware, deleteAccessorie);

export default router;
