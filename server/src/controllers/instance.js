import { ConstMessages, CollectionNames } from 'asset-management-common/constants/index.js';
import logHistory from 'asset-management-common/helpers/logHistory.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import validateError from '../lib/helpers/validateError.js';
import getModelByName from '../lib/helpers/getModelByName.js';

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
        this.checkInInstance = this.checkInInstance.bind(this);
        this.checkOutInstance = this.checkOutInstance.bind(this);

        this._router.route('/:id/instances').get(this.getInstances);
        this._router.route('/:id/instances/:instanceId/checkin').post(this.checkInInstance);
        this._router.route('/:id/instances/:instanceId/checkout').post(this.checkOutInstance);
    }

    async _handlePolymorphicPopulate(items) {
        const { models } = await import('../lib/models/index.js');
        const isArray = Array.isArray(items);
        const itemsArray = isArray ? items : [items];

        for (const item of itemsArray) {
            if (item && item.assignee) {
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

    async getInstances(request, response) {
        try {
            const { id } = request.params;
            const { page = 1, limit = 10 } = request.query;

            const parent = await this._parentCollection.findOne({ id: Number(id) }).lean();
            if (!parent) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;

            const total = await this._collection.countDocuments({ parentId: Number(id) });
            let items = await this._collection
                .find({ parentId: Number(id) })
                .sort({ instanceNumber: 1 })
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

    async checkInInstance(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const { id, instanceId } = request.params;

            const parent = await this._parentCollection.findOne({ id: Number(id) }).lean();
            if (!parent) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            const instance = await this._collection.findOne({
                id: Number(instanceId),
                parentId: Number(id),
            });
            if (!instance) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: 'Instance not found' });
            }

            if (!instance.assignee) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: 'Instance is not checked out' });
            }

            const previousAssignee = instance.assignee;
            const previousAssigneeModel = instance.assigneeModel;
            const previousActualAssigneeModel = instance.actualAssigneeModel;
            let previousAssigneeName = '';

            if (previousAssignee) {
                const actualModel =
                    previousAssigneeModel === 'common'
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
                            if (actualModel === 'users') {
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
                    { id: Number(instanceId) },
                    {
                        $unset: { assignee: '', actualAssigneeModel: '', assignedAt: '' },
                        $set: { status: 'available' },
                    },
                    { new: true, runValidators: true },
                )
                .lean();

            await logHistory(models.History, {
                resourceType: this._instanceCollectionName,
                resourceId: Number(instanceId),
                action: 'checkin',
                metadata: {
                    name: `${parent.name} #${instance.instanceNumber}`,
                    parentId: Number(id),
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
            const { models } = await import('../lib/models/index.js');
            const { id, instanceId } = request.params;
            const { assigneeModel, actualAssigneeModel, assignee } = request.body;

            if (!assignee || !actualAssigneeModel) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: 'assignee and actualAssigneeModel are required' });
            }

            const parent = await this._parentCollection.findOne({ id: Number(id) }).lean();
            if (!parent) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            const instance = await this._collection.findOne({
                id: Number(instanceId),
                parentId: Number(id),
            });
            if (!instance) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: 'Instance not found' });
            }

            const capitalizedModel =
                actualAssigneeModel.charAt(0).toUpperCase() + actualAssigneeModel.slice(1);
            const AssigneeModel = models[capitalizedModel];
            if (!AssigneeModel) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: `Invalid assignee model: ${actualAssigneeModel}` });
            }

            const assigneeExists = await AssigneeModel.findOne({ id: Number(assignee) }).lean();
            if (!assigneeExists) {
                return response.status(StatusCodes.NOT_FOUND).send({
                    message: `Assignee with id ${assignee} not found in ${actualAssigneeModel}`,
                });
            }

            let assigneeName = '';
            if (actualAssigneeModel === 'users') {
                assigneeName = [assigneeExists.firstName, assigneeExists.lastName]
                    .filter(Boolean)
                    .join(' ');
            } else {
                assigneeName = assigneeExists.name || '';
            }

            let updatedInstance = await this._collection
                .findOneAndUpdate(
                    { id: Number(instanceId) },
                    {
                        $set: {
                            assigneeModel: assigneeModel || actualAssigneeModel,
                            actualAssigneeModel,
                            assignee: Number(assignee),
                            assignedAt: new Date(),
                            status: 'assigned',
                        },
                    },
                    { new: true, runValidators: true },
                )
                .lean();

            await logHistory(models.History, {
                resourceType: this._instanceCollectionName,
                resourceId: Number(instanceId),
                action: 'checkout',
                metadata: {
                    name: `${parent.name} #${instance.instanceNumber}`,
                    parentId: Number(id),
                    parentName: parent.name,
                    assigneeId: Number(assignee),
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
