import { CollectionNames, FieldNames } from 'asset-management-common/constants/index.js';

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
                path: FieldNames.owner,
                model: CollectionNames.users,
                select: `${FieldNames.id} ${FieldNames.username} ${FieldNames.firstName} ${FieldNames.lastName} ${FieldNames.email}`,
            },
        ],
        [CollectionNames.departments]: [
            {
                path: FieldNames.manager,
                model: CollectionNames.users,
                select: `${FieldNames.id} ${FieldNames.username} ${FieldNames.firstName} ${FieldNames.lastName} ${FieldNames.email}`,
            },
        ],
        [CollectionNames.locations]: [
            {
                path: FieldNames.parent,
                model: CollectionNames.locations,
                select: `${FieldNames.id} ${FieldNames.name}`,
            },
            {
                path: FieldNames.manager,
                model: CollectionNames.users,
                select: `${FieldNames.id} ${FieldNames.username} ${FieldNames.firstName} ${FieldNames.lastName} ${FieldNames.email}`,
            },
            {
                path: FieldNames.company,
                model: CollectionNames.companies,
                select: `${FieldNames.id} ${FieldNames.name}`,
            },
        ],
        [CollectionNames.users]: [
            {
                path: FieldNames.location,
                model: CollectionNames.locations,
                select: `${FieldNames.id} ${FieldNames.name}`,
            },
            {
                path: FieldNames.company,
                model: CollectionNames.companies,
                select: `${FieldNames.id} ${FieldNames.name}`,
            },
            {
                path: FieldNames.department,
                model: CollectionNames.departments,
                select: `${FieldNames.id} ${FieldNames.name}`,
            },
            {
                path: FieldNames.jobtitle,
                model: CollectionNames.jobtitles,
                select: `${FieldNames.id} ${FieldNames.name}`,
            },
            {
                path: FieldNames.seniority,
                model: CollectionNames.seniorities,
                select: `${FieldNames.id} ${FieldNames.name}`,
            },
        ],
        [CollectionNames.history]: [
            {
                path: FieldNames.performedBy,
                model: CollectionNames.users,
                select: `${FieldNames.id} ${FieldNames.username} ${FieldNames.firstName} ${FieldNames.lastName} ${FieldNames.email}`,
            },
        ],
    };

    return populateMap[collectionName] || [];
};

export default getPopulateFields;
