import { locations } from '../controllers/index.js';

locations.router.route('/').get(locations.getItems).post(locations.createItem);

locations.router
    .route('/:id')
    .get(locations.getItem)
    .put(locations.updateItem)
    .patch(locations.updateItem)
    .delete(locations.deleteItem);

export default locations.router;
