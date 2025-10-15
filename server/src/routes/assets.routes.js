import { Router } from 'express';
import {
    getAssets,
    getAsset,
    updateAsset,
    deleteAsset,
    createAsset,
} from '../controllers/assets.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/').get(getAssets).post(adminMiddleware, createAsset);

router
    .route('/:id')
    .get(getAsset)
    .put(adminMiddleware, updateAsset)
    .patch(adminMiddleware, updateAsset)
    .delete(adminMiddleware, deleteAsset);

export default router;
