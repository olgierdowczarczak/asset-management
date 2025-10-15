import { Router } from 'express';
import {
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation,
    createLocation,
} from '../controllers/locations.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/', adminMiddleware).get(getLocations).post(adminMiddleware, createLocation);

router
    .route('/:id')
    .get(getLocation)
    .put(adminMiddleware, updateLocation)
    .patch(adminMiddleware, updateLocation)
    .delete(adminMiddleware, deleteLocation);

export default router;
