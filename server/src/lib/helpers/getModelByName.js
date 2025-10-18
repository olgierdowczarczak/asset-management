import { Models } from '../models/index.js';

/**
 * @param {string} collectionName
 */
const getModelByName = (collectionName) => {
    /**
     * @param {string} collectionName
     */
    const capitalizeFirstLetter = (str) => {
        if (!str) {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    return Models[capitalizeFirstLetter(collectionName)];
};

export default getModelByName;
