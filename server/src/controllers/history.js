import {
    ConstMessages,
    CollectionNames,
    QueryParamConstants,
    RouteParamConstants,
    FieldNames,
    SortConstants,
    MongoOperators,
    HistoryActions,
} from 'asset-management-common/constants/index.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import validateError from '../lib/helpers/validateError.js';
import config from '../config/index.js';
import { models } from '../lib/models/index.js';

class History extends Endpoint {
    constructor() {
        super();
        this._collectionName = CollectionNames.history;
        this.getHistory = this.getHistory.bind(this);
        this.getResourceHistory = this.getResourceHistory.bind(this);
        this.getUserHistory = this.getUserHistory.bind(this);

        this._router.route('/').get(this.getHistory);
        this._router
            .route(
                `${RouteParamConstants.resource}${RouteParamConstants.resourceType}${RouteParamConstants.resourceId}`,
            )
            .get(this.getResourceHistory);
        this._router
            .route(`${RouteParamConstants.user}${RouteParamConstants.userId}`)
            .get(this.getUserHistory);
    }

    async getHistory(request, response) {
        try {
            const {
                [QueryParamConstants.page]: page = 1,
                [QueryParamConstants.limit]: limit = config.PAGINATION_DEFAULT_LIMIT,
                [QueryParamConstants.resourceType]: resourceType,
                [QueryParamConstants.resourceId]: resourceId,
                dateFrom,
                dateTo,
                performedBy,
                assigneeId,
                searchTerm,
                action,
            } = request.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const filters = {};

            if (resourceType) {
                filters[QueryParamConstants.resourceType] = resourceType;
            }
            if (resourceId) {
                filters[QueryParamConstants.resourceId] = Number(resourceId);
            }

            if (dateFrom || dateTo) {
                filters[FieldNames.timestamp] = {};
                if (dateFrom) {
                    filters[FieldNames.timestamp][MongoOperators.gte] = new Date(dateFrom);
                }
                if (dateTo) {
                    const endDate = new Date(dateTo);
                    endDate.setHours(23, 59, 59, 999);
                    filters[FieldNames.timestamp][MongoOperators.lte] = endDate;
                }
            }

            if (performedBy) {
                filters[FieldNames.performedBy] = Number(performedBy);
            }

            if (action) {
                filters.action = action;
            }

            if (assigneeId) {
                filters['metadata.assigneeId'] = Number(assigneeId);
            }

            if (searchTerm) {
                const searchRegex = new RegExp(searchTerm, 'i');
                filters[MongoOperators.or] = [
                    { 'metadata.name': searchRegex },
                    { 'metadata.assigneeName': searchRegex },
                    { 'metadata.previousAssigneeName': searchRegex },
                ];
            }

            const total = await models.History.countDocuments(filters);
            const items = await models.History.find(filters)
                .sort({ [FieldNames.timestamp]: SortConstants.descending })
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
            const {
                [QueryParamConstants.resourceType]: resourceType,
                [QueryParamConstants.resourceId]: resourceId,
            } = request.params;
            const {
                [QueryParamConstants.page]: page = 1,
                [QueryParamConstants.limit]: limit = config.PAGINATION_DEFAULT_LIMIT,
            } = request.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const filters = {
                [QueryParamConstants.resourceType]: resourceType,
                [QueryParamConstants.resourceId]: Number(resourceId),
            };
            const total = await models.History.countDocuments(filters);
            const items = await models.History.find(filters)
                .sort({ [FieldNames.timestamp]: SortConstants.descending })
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
            const { [QueryParamConstants.userId]: userId } = request.params;
            const {
                [QueryParamConstants.page]: page = 1,
                [QueryParamConstants.limit]: limit = config.PAGINATION_DEFAULT_LIMIT,
            } = request.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const filters = {
                [MongoOperators.or]: [
                    { [FieldNames.performedBy]: Number(userId) },
                    {
                        [QueryParamConstants.resourceType]: {
                            [MongoOperators.in]: [
                                CollectionNames.assets,
                                CollectionNames.accessories,
                                CollectionNames.licenses,
                            ],
                        },
                        action: {
                            [MongoOperators.in]: [HistoryActions.checkin, HistoryActions.checkout],
                        },
                        'metadata.assigneeId': Number(userId),
                    },
                ],
            };

            const total = await models.History.countDocuments(filters);
            const items = await models.History.find(filters)
                .sort({ [FieldNames.timestamp]: SortConstants.descending })
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
