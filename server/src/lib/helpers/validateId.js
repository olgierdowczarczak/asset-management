/**
 * Validates and parses a numeric ID
 * @param {string|number} id - The ID to validate
 * @returns {number} - The parsed numeric ID
 * @throws {Error} - If ID is invalid
 */
export default function validateId(id) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
        throw new Error('Invalid ID format');
    }

    return numericId;
}
