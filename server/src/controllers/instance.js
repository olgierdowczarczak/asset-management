import {
    ConstMessages,
    CollectionNames,
    StatusValues,
    ModelNames,
    HistoryActions,
    MongoOperators,
    QueryParamConstants,
    RouteParamConstants,
    SortConstants,
    FieldNames,
} from 'asset-management-common/constants/index.js';
import logHistory from 'asset-management-common/helpers/logHistory.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import validateError from '../lib/helpers/validateError.js';
import validateId from '../lib/helpers/validateId.js';
import getModelByName from '../lib/helpers/getModelByName.js';
import handlePolymorphicPopulate from '../lib/helpers/handlePolymorphicPopulate.js';
import config from '../config/index.js';
import { models } from '../lib/models/index.js';

class Instance extends Endpoint {
    constructor(parentEndpoint) {
        super();
        this._parentEndpoint = parentEndpoint;
        this._parentCollectionName = parentEndpoint;
        this._isAccessory = parentEndpoint === CollectionNames.accessories;
        this._instanceCollectionName = this._isAccessory
            ? CollectionNames.accessoryInstances
            : CollectionNames.licenseInstances;
        this._collection = getModelByName(this._instanceCollectionName);
        this._parentCollection = getModelByName(this._parentCollectionName);

        this.getInstances = this.getInstances.bind(this);
        this.getInstanceStats = this.getInstanceStats.bind(this);
        this.checkInInstance = this.checkInInstance.bind(this);
        this.checkOutInstance = this.checkOutInstance.bind(this);

        this._router
            .route(`${RouteParamConstants.instances}${RouteParamConstants.stats}`)
            .get(this.getInstanceStats);
        this._router
            .route(`${RouteParamConstants.id}${RouteParamConstants.instances}`)
            .get(this.getInstances);
        this._router
            .route(
                `${RouteParamConstants.id}${RouteParamConstants.instances}${RouteParamConstants.instanceId}${RouteParamConstants.checkin}`,
            )
            .post(this.checkInInstance);
        this._router
            .route(
                `${RouteParamConstants.id}${RouteParamConstants.instances}${RouteParamConstants.instanceId}${RouteParamConstants.checkout}`,
            )
            .post(this.checkOutInstance);
    }

    async _handlePolymorphicPopulate(items) {
        return handlePolymorphicPopulate(items);
    }

    async getInstances(request, response) {
        try {
            const id = validateId(request.params.id);
            const {
                [QueryParamConstants.page]: page = 1,
                [QueryParamConstants.limit]: limit = config.PAGINATION_DEFAULT_LIMIT,
            } = request.query;

            const parent = await this._parentCollection.findOne({ id }).lean();
            if (!parent) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;

            const total = await this._collection.countDocuments({ parentId: id });
            let items = await this._collection
                .find({ [FieldNames.parentId]: id })
                .sort({ [FieldNames.instanceNumber]: SortConstants.ascending })
                .skip(skip)
                .limit(limitNum)
                .lean();

            items = await this._handlePolymorphicPopulate(items);

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
            const errorMessage = validateError(error) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async getInstanceStats(request, response) {
        try {
            const assignedCount = await this._collection.countDocuments({
                [FieldNames.assignee]: { [MongoOperators.exists]: true, [MongoOperators.ne]: null },
            });
            const unassignedCount = await this._collection.countDocuments({
                [MongoOperators.or]: [
                    { [FieldNames.assignee]: { [MongoOperators.exists]: false } },
                    { [FieldNames.assignee]: null },
                ],
            });

            response.status(StatusCodes.OK).send({
                assigned: assignedCount,
                unassigned: unassignedCount,
                total: assignedCount + unassignedCount,
            });
        } catch (error) {
            const errorMessage = validateError(error) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async checkInInstance(request, response) {
        try {
            const id = validateId(request.params.id);
            const instanceId = validateId(request.params.instanceId);
            const parent = await this._parentCollection.findOne({ id }).lean();
            if (!parent) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            const instance = await this._collection.findOne({
                id: instanceId,
                parentId: id,
            });
            if (!instance) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.instanceNotFound });
            }

            if (!instance.assignee) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: ConstMessages.instanceNotCheckedOut });
            }

            const previousAssignee = instance.assignee;
            const previousAssigneeModel = instance.assigneeModel;
            const previousActualAssigneeModel = instance.actualAssigneeModel;
            let previousAssigneeName = '';

            if (previousAssignee) {
                const actualModel =
                    previousAssigneeModel === ModelNames.common
                        ? previousActualAssigneeModel
                        : previousAssigneeModel;
                if (actualModel) {
                    const capitalizedModel =
                        actualModel.charAt(0).toUpperCase() + actualModel.slice(1);
                    const AssigneeModel = models[capitalizedModel];
                    if (AssigneeModel) {
                        const assigneeDoc = await AssigneeModel.findOne({
                            id: previousAssignee,
                        }).lean();
                        if (assigneeDoc) {
                            if (actualModel === ModelNames.users) {
                                previousAssigneeName = [assigneeDoc.firstName, assigneeDoc.lastName]
                                    .filter(Boolean)
                                    .join(' ');
                            } else {
                                previousAssigneeName = assigneeDoc.name || '';
                            }
                        }
                    }
                }
            }

            let updatedInstance = await this._collection
                .findOneAndUpdate(
                    { id: instanceId },
                    {
                        [MongoOperators.unset]: {
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                    { new: true, runValidators: true },
                )
                .lean();

            await logHistory(models.History, {
                resourceType: this._instanceCollectionName,
                resourceId: instanceId,
                action: HistoryActions.checkin,
                metadata: {
                    name: `${parent.name} #${instance.instanceNumber}`,
                    parentId: id,
                    parentName: parent.name,
                    previousAssignee,
                    previousAssigneeName,
                    previousAssigneeModel,
                    previousActualAssigneeModel,
                },
            });

            updatedInstance = await this._handlePolymorphicPopulate(updatedInstance);
            response.status(StatusCodes.OK).send(updatedInstance);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async checkOutInstance(request, response) {
        try {
            const id = validateId(request.params.id);
            const instanceId = validateId(request.params.instanceId);
            const { assigneeModel, actualAssigneeModel, assignee } = request.body;
            if (!assignee || !actualAssigneeModel) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: ConstMessages.assigneeRequired });
            }

            const parent = await this._parentCollection.findOne({ id }).lean();
            if (!parent) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            const instance = await this._collection.findOne({
                id: instanceId,
                parentId: id,
            });
            if (!instance) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.instanceNotFound });
            }

            const capitalizedModel =
                actualAssigneeModel.charAt(0).toUpperCase() + actualAssigneeModel.slice(1);
            const AssigneeModel = models[capitalizedModel];
            if (!AssigneeModel) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: ConstMessages.invalidAssigneeModel(actualAssigneeModel) });
            }

            const assigneeExists = await AssigneeModel.findOne({ id: Number(assignee) }).lean();
            if (!assigneeExists) {
                return response.status(StatusCodes.NOT_FOUND).send({
                    message: ConstMessages.assigneeNotFound(assignee, actualAssigneeModel),
                });
            }

            let assigneeName = '';
            if (actualAssigneeModel === ModelNames.users) {
                assigneeName = [assigneeExists.firstName, assigneeExists.lastName]
                    .filter(Boolean)
                    .join(' ');
            } else {
                assigneeName = assigneeExists.name || '';
            }

            let updatedInstance = await this._collection
                .findOneAndUpdate(
                    { id: instanceId },
                    {
                        [MongoOperators.set]: {
                            assigneeModel: assigneeModel || actualAssigneeModel,
                            actualAssigneeModel,
                            assignee: validateId(assignee),
                            assignedAt: new Date(),
                            status: StatusValues.assigned,
                        },
                    },
                    { new: true, runValidators: true },
                )
                .lean();

            await logHistory(models.History, {
                resourceType: this._instanceCollectionName,
                resourceId: instanceId,
                action: HistoryActions.checkout,
                metadata: {
                    name: `${parent.name} #${instance.instanceNumber}`,
                    parentId: id,
                    parentName: parent.name,
                    assigneeId: validateId(assignee),
                    assigneeName,
                    assigneeModel: assigneeModel || actualAssigneeModel,
                    actualAssigneeModel,
                },
            });

            updatedInstance = await this._handlePolymorphicPopulate(updatedInstance);
            response.status(StatusCodes.OK).send(updatedInstance);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }
}

export default Instance;
