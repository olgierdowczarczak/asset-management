import { Router } from 'express';
import {
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment,
    createDepartment,
} from '../controllers/departments.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/').get(getDepartments).post(adminMiddleware, createDepartment);

router
    .route('/:id')
    .get(getDepartment)
    .put(adminMiddleware, updateDepartment)
    .patch(adminMiddleware, updateDepartment)
    .delete(adminMiddleware, deleteDepartment);

export default router;
