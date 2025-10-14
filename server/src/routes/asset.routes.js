import { Router } from 'express';
import {
    getAsset,
    updateAsset,
    deleteAsset,
    getActiveAssets,
    getAllAssets,
    getDeletedAssets,
    createAsset,
} from '../controllers/asset.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/').get(getActiveAssets).post(adminMiddleware, createAsset);

router.get('/all', adminMiddleware, getAllAssets);
router.get('/deleted', adminMiddleware, getDeletedAssets);
router
    .route('/:id')
    .get(getAsset)
    .put(adminMiddleware, updateAsset)
    .patch(adminMiddleware, updateAsset)
    .delete(adminMiddleware, deleteAsset);

export default router;
