import getLastDocument from './getLastDocument.js';

/**
 * Creates a history entry for a resource action
 * @param {Object} History - Mongoose History model
 * @param {Object} options - History entry options
 * @param {string} options.resourceType - Type of resource (assets, accessories, etc.)
 * @param {number} options.resourceId - ID of the resource
 * @param {string} options.action - Action performed (created, updated, checkin, checkout, deleted)
 * @param {number} [options.performedBy] - ID of user who performed the action
 * @param {Object} [options.changes] - Map of changes for update actions
 * @param {Object} [options.metadata] - Additional metadata
 * @returns {Promise<Object>} Created history entry
 */
export default async function logHistory(History, options) {
    const { resourceType, resourceId, action, performedBy, changes, metadata } = options;

    const lastId = await getLastDocument(History);
    const historyEntry = new History({
        id: lastId,
        resourceType,
        resourceId,
        action,
        performedBy,
        changes,
        metadata,
        timestamp: new Date(),
    });

    await historyEntry.save();
    return historyEntry;
}
