import { Router } from 'express';
import { 
    getLicense, updateLicense, deleteLicense,
    getLicenses, createLicense 
} from '../controllers/license.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/')
    .get(getLicenses)
    .post(adminMiddleware, createLicense);
    
router.route('/:id')
    .get(getLicense)
    .put(adminMiddleware, updateLicense)
    .patch(adminMiddleware, updateLicense)
    .delete(adminMiddleware, deleteLicense);

export default router;