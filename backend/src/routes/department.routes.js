import { Router } from 'express';
import { 
    getDepartment, updateDepartment, deleteDepartment,
    getDepartments, createDepartment 
} from '../controllers/department.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = Router();
router.route('/')
    .get(getDepartments)
    .post(adminMiddleware, createDepartment);
    
router.route('/:id')
    .get(getDepartment)
    .put(adminMiddleware, updateDepartment)
    .patch(adminMiddleware, updateDepartment)
    .delete(adminMiddleware, deleteDepartment);

export default router;