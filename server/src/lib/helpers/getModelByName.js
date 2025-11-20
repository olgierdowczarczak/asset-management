import { models } from '../models/index.js';

/**
 * @param {String} collectionName
 */
const getModelByName = (collectionName) => {
    const toPascalCase = () => {
        if (!collectionName) {
            return '';
        }
        return collectionName
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    };
    return models[toPascalCase()];
};

export default getModelByName;
