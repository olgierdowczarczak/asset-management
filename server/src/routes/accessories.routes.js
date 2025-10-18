import { accessories } from '../controllers/index.js';

accessories.router.route('/').get(accessories.getItems).post(accessories.createItem);

accessories.router
    .route('/:id')
    .get(accessories.getItem)
    .put(accessories.updateItem)
    .patch(accessories.updateItem)
    .delete(accessories.deleteItem);

export default accessories.router;
