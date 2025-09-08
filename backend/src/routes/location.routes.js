import { Router } from 'express';
import { 
    getLocation, updateLocation, deleteLocation,
    getLocations, createLocation 
} from '../controllers/location.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/')
    .get(getLocations)
    .post(adminMiddleware, createLocation);
    
router.route('/:id')
    .get(getLocation)
    .put(adminMiddleware, updateLocation)
    .patch(adminMiddleware, updateLocation)
    .delete(adminMiddleware, deleteLocation);

export default router;