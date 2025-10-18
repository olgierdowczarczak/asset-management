import { departments } from '../controllers/index.js';

departments.router.route('/').get(departments.getItems).post(departments.createItem);

departments.router
    .route('/:id')
    .get(departments.getItem)
    .put(departments.updateItem)
    .patch(departments.updateItem)
    .delete(departments.deleteItem);

export default departments.router;
