import { ConstMessages, CollectionNames } from 'asset-management-common/constants/index.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import validateError from '../lib/helpers/validateError.js';
import config from '../config/index.js';

class History extends Endpoint {
    constructor() {
        super();
        this._collectionName = CollectionNames.history;
        this.getHistory = this.getHistory.bind(this);
        this.getResourceHistory = this.getResourceHistory.bind(this);
        this.getUserHistory = this.getUserHistory.bind(this);

        this._router.route('/').get(this.getHistory);
        this._router.route('/resource/:resourceType/:resourceId').get(this.getResourceHistory);
        this._router.route('/user/:userId').get(this.getUserHistory);
    }

    async getHistory(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const {
                page = 1,
                limit = config.PAGINATION_DEFAULT_LIMIT,
                resourceType,
                resourceId,
            } = request.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const filters = {};

            if (resourceType) {
                filters.resourceType = resourceType;
            }
            if (resourceId) {
                filters.resourceId = Number(resourceId);
            }

            const total = await models.History.countDocuments(filters);
            const items = await models.History.find(filters)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean();

            response.status(StatusCodes.OK).send({
                items,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1,
                },
            });
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }

    async getResourceHistory(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const { resourceType, resourceId } = request.params;
            const { page = 1, limit = config.PAGINATION_DEFAULT_LIMIT } = request.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const filters = {
                resourceType,
                resourceId: Number(resourceId),
            };
            const total = await models.History.countDocuments(filters);
            const items = await models.History.find(filters)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean();

            response.status(StatusCodes.OK).send({
                items,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1,
                },
            });
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }

    async getUserHistory(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const { userId } = request.params;
            const { page = 1, limit = config.PAGINATION_DEFAULT_LIMIT } = request.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const filters = {
                $or: [
                    { performedBy: Number(userId) },
                    {
                        resourceType: { $in: ['assets', 'accessories', 'licenses'] },
                        action: { $in: ['checkin', 'checkout'] },
                        'metadata.assigneeId': Number(userId),
                    },
                ],
            };

            const total = await models.History.countDocuments(filters);
            const items = await models.History.find(filters)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean();

            response.status(StatusCodes.OK).send({
                items,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1,
                },
            });
        } catch (error) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }
}

export default History;
