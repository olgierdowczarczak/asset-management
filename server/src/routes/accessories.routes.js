import { Router } from 'express';
import {
    getAccessories,
    getAccessorie,
    updateAccessorie,
    deleteAccessorie,
    createAccessorie,
} from '../controllers/accessories.controllers.js';
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
