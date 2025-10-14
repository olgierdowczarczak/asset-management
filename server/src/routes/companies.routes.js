import { Router } from 'express';
import {
    getCompany,
    updateCompany,
    deleteCompany,
    getCompanies,
    createCompany,
} from '../controllers/company.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/').get(getCompanies).post(adminMiddleware, createCompany);

router
    .route('/:id')
    .get(getCompany)
    .put(adminMiddleware, updateCompany)
    .patch(adminMiddleware, updateCompany)
    .delete(adminMiddleware, deleteCompany);

export default router;
