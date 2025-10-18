import { companies } from '../controllers/index.js';

companies.router.route('/').get(companies.getItems).post(companies.createItem);

companies.router
    .route('/:id')
    .get(companies.getItem)
    .put(companies.updateItem)
    .patch(companies.updateItem)
    .delete(companies.deleteItem);

export default companies.router;
