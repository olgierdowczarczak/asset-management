import { models } from '../models/index.js';
import { FieldNames, ModelNames } from 'asset-management-common/constants/index.js';

/**
 * Handles population of polymorphic references (assignee field that can point to users or locations)
 * @param {Object|Array} items - Items to populate
 * @returns {Promise<Object|Array>} - Populated items
 */
export default async function handlePolymorphicPopulate(items) {
    const isArray = Array.isArray(items);
    const itemsArray = isArray ? items : [items];
    for (const item of itemsArray) {
        if (item && item[FieldNames.assignee] !== null && item[FieldNames.assignee] !== undefined) {
            const modelToUse =
                item[FieldNames.assigneeModel] === ModelNames.common
                    ? item[FieldNames.actualAssigneeModel]
                    : item[FieldNames.assigneeModel];

            if (!modelToUse) {
                continue;
            }

            const capitalizedName = modelToUse.charAt(0).toUpperCase() + modelToUse.slice(1);
            const Model = models[capitalizedName];

            if (Model) {
                const refDoc = await Model.findOne({ [FieldNames.id]: item[FieldNames.assignee] })
                    .select(
                        `${FieldNames.id} ${FieldNames.name} ${FieldNames.username} ${FieldNames.firstName} ${FieldNames.lastName}`,
                    )
                    .lean();

                if (refDoc) {
                    item[FieldNames.assignee] = refDoc;
                }
            }
        }
    }

    return isArray ? itemsArray : itemsArray[0];
}
