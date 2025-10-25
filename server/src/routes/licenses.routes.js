import { licenses } from '../controllers/index.js';

licenses.router.route('/').get(licenses.getItems).post(licenses.createItem);

licenses.router
    .route('/:id')
    .get(licenses.getItem)
    .put(licenses.updateItem)
    .patch(licenses.updateItem)
    .delete(licenses.deleteItem);

export default licenses.router;
