import { CollectionNames } from 'asset-management-common/constants/index.js';

/**
 * @param {String} collectionName
 * @returns {Array<Object|String>}
 */
const getPopulateFields = (collectionName) => {
    const populateMap = {
        [CollectionNames.accessories]: [],
        [CollectionNames.licenses]: [],
        [CollectionNames.assets]: [],
        [CollectionNames.companies]: [
            {
                path: 'owner',
                model: CollectionNames.users,
                select: 'id username firstName lastName email',
            },
        ],
        [CollectionNames.departments]: [
            {
                path: 'manager',
                model: CollectionNames.users,
                select: 'id username firstName lastName email',
            },
        ],
        [CollectionNames.locations]: [
            {
                path: 'parent',
                model: CollectionNames.locations,
                select: 'id name',
            },
        ],
        [CollectionNames.users]: [
            {
                path: 'location',
                model: CollectionNames.locations,
                select: 'id name',
            },
            {
                path: 'company',
                model: CollectionNames.companies,
                select: 'id name',
            },
            {
                path: 'department',
                model: CollectionNames.departments,
                select: 'id name',
            },
        ],
    };

    return populateMap[collectionName] || [];
};

export default getPopulateFields;
