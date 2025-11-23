import { models } from '../models/index.js';

/**
 * Handles population of polymorphic references (assignee field that can point to users or locations)
 * @param {Object|Array} items - Items to populate
 * @returns {Promise<Object|Array>} - Populated items
 */
export default async function handlePolymorphicPopulate(items) {
    const isArray = Array.isArray(items);
    const itemsArray = isArray ? items : [items];
    for (const item of itemsArray) {
        if (item && item.assignee !== null && item.assignee !== undefined) {
            const modelToUse =
                item.assigneeModel === 'common' ? item.actualAssigneeModel : item.assigneeModel;

            if (!modelToUse) {
                continue;
            }

            const capitalizedName = modelToUse.charAt(0).toUpperCase() + modelToUse.slice(1);
            const Model = models[capitalizedName];

            if (Model) {
                const refDoc = await Model.findOne({ id: item.assignee })
                    .select('id name username firstName lastName')
                    .lean();

                if (refDoc) {
                    item.assignee = refDoc;
                }
            }
        }
    }

    return isArray ? itemsArray : itemsArray[0];
}
