import { models } from '../models/index.js';

/**
 * @param {String} collectionName
 */
const getModelByName = (collectionName) => {
    const capitalizeFirstLetter = () => {
        if (!collectionName) {
            return '';
        }
        return collectionName.charAt(0).toUpperCase() + collectionName.slice(1).toLowerCase();
    };
    return models[capitalizeFirstLetter()];
};

export default getModelByName;
