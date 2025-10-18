import { assets } from '../controllers/index.js';

assets.router.route('/').get(assets.getItems).post(assets.createItem);

assets.router
    .route('/:id')
    .get(assets.getItem)
    .put(assets.updateItem)
    .patch(assets.updateItem)
    .delete(assets.deleteItem);

export default assets.router;
