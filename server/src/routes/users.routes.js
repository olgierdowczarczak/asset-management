import { users } from '../controllers/index.js';

users.router.route('/').get(users.getItems).post(users.createItem);

users.router
    .route('/:id')
    .get(users.getItem)
    .put(users.updateItem)
    .patch(users.updateItem)
    .delete(users.deleteItem);

export default users.router;
