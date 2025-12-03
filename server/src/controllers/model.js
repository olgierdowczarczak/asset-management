import {
    ConstMessages,
    CollectionNames,
    StatusValues,
    ModelNames,
    HistoryActions,
    FieldNames,
    MongoOperators,
    QueryParamConstants,
    RouteParamConstants,
} from 'asset-management-common/constants/index.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import logHistory from 'asset-management-common/helpers/logHistory.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import validateError from '../lib/helpers/validateError.js';
import validateId from '../lib/helpers/validateId.js';
import getModelByName from '../lib/helpers/getModelByName.js';
import getPopulateFields from '../lib/helpers/getPopulateFields.js';
import handlePolymorphicPopulate from '../lib/helpers/handlePolymorphicPopulate.js';
import config from '../config/index.js';
import { models } from '../lib/models/index.js';

class Model extends Endpoint {
    constructor(endpoint) {
        super();
        this._collection = getModelByName(endpoint);
        this._collectionName = endpoint;
        this.getItems = this.getItems.bind(this);
        this.createItem = this.createItem.bind(this);
        this.getItem = this.getItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.checkIn = this.checkIn.bind(this);
        this.checkOut = this.checkOut.bind(this);

        this._router.route('/').get(this.getItems).post(this.createItem);
        this._router
            .route(RouteParamConstants.id)
            .get(this.getItem)
            .put(this.updateItem)
            .patch(this.updateItem)
            .delete(this.deleteItem);

        const supportsCheckInOut = [CollectionNames.assets];

        if (supportsCheckInOut.includes(endpoint)) {
            this._router
                .route(`${RouteParamConstants.id}${RouteParamConstants.checkin}`)
                .post(this.checkIn);
            this._router
                .route(`${RouteParamConstants.id}${RouteParamConstants.checkout}`)
                .post(this.checkOut);
        }
    }

    async _manualPopulate(items) {
        const isArray = Array.isArray(items);
        const itemsArray = isArray ? items : [items];
        if (itemsArray.length === 0) {
            return items;
        }

        const populateConfig = getPopulateFields(this._collectionName);
        for (const config of populateConfig) {
            const { path, model, select } = config;
            const idsToPopulate = new Set();
            itemsArray.forEach((item) => {
                if (item[path]) {
                    idsToPopulate.add(item[path]);
                }
            });

            if (idsToPopulate.size === 0) {
                continue;
            }

            const capitalizedName = model.charAt(0).toUpperCase() + model.slice(1);
            const Model = models[capitalizedName];
            if (!Model) {
                continue;
            }

            const refDocs = await Model.find({ id: { $in: Array.from(idsToPopulate) } })
                .select(select)
                .lean();

            const refMap = new Map();
            refDocs.forEach((doc) => {
                refMap.set(doc.id, doc);
            });

            itemsArray.forEach((item) => {
                if (item[path] && refMap.has(item[path])) {
                    item[path] = refMap.get(item[path]);
                }
            });
        }

        return isArray ? itemsArray : itemsArray[0];
    }

    async _handlePolymorphicPopulate(items) {
        const collectionsWithPolymorphic = [CollectionNames.assets];

        if (!collectionsWithPolymorphic.includes(this._collectionName)) {
            return items;
        }

        return handlePolymorphicPopulate(items);
    }

    async getItems(request, response) {
        try {
            const {
                [QueryParamConstants.page]: page = 1,
                [QueryParamConstants.limit]: limit = config.PAGINATION_DEFAULT_LIMIT,
            } = request.query;
            const filters = request.body || {};
            const collectionsWithSoftDelete = [
                CollectionNames.assets,
                CollectionNames.accessories,
                CollectionNames.licenses,
            ];

            if (collectionsWithSoftDelete.includes(this._collectionName)) {
                filters[FieldNames.isDeleted] = { [MongoOperators.ne]: true };
            }

            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(config.PAGINATION_MAX_LIMIT, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const total = await this._collection.countDocuments(filters);
            let items = await this._collection.find(filters).skip(skip).limit(limitNum).lean();
            items = await this._manualPopulate(items);
            items = await this._handlePolymorphicPopulate(items);

            if (this._collectionName === CollectionNames.users) {
                items = items.map((item) => {
                    if (item[FieldNames.password]) {
                        delete item[FieldNames.password];
                    }
                    return item;
                });
            }

            const collectionsWithInstances = [
                CollectionNames.accessories,
                CollectionNames.licenses,
            ];
            if (collectionsWithInstances.includes(this._collectionName)) {
                const InstanceModel =
                    this._collectionName === CollectionNames.accessories
                        ? models.AccessoryInstances
                        : models.LicenseInstances;

                if (InstanceModel) {
                    const itemsWithCounts = await Promise.all(
                        items.map(async (item) => {
                            const assignedCount = await InstanceModel.countDocuments({
                                parentId: item.id,
                                status: StatusValues.assigned,
                            });
                            return {
                                ...item,
                                assignedCount,
                            };
                        }),
                    );
                    items = itemsWithCounts;
                }
            }

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

    async getItem(request, response) {
        try {
            const id = validateId(request.params.id);
            let item = await this._collection.findOne({ id }).lean();
            if (!item) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }
            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);

            if (this._collectionName === CollectionNames.users && item[FieldNames.password]) {
                delete item[FieldNames.password];
            }

            const collectionsWithInstances = [
                CollectionNames.accessories,
                CollectionNames.licenses,
            ];
            if (collectionsWithInstances.includes(this._collectionName)) {
                const InstanceModel =
                    this._collectionName === CollectionNames.accessories
                        ? models.AccessoryInstances
                        : models.LicenseInstances;

                if (InstanceModel) {
                    const assignedCount = await InstanceModel.countDocuments({
                        parentId: item.id,
                        status: StatusValues.assigned,
                    });
                    item.assignedCount = assignedCount;
                }
            }

            response.status(StatusCodes.OK).send(item);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async updateItem(request, response) {
        try {
            const id = validateId(request.params.id);
            if (this._collectionName === CollectionNames.users && id === config.ADMIN_USER_ID) {
                return response
                    .status(StatusCodes.FORBIDDEN)
                    .send({ message: ConstMessages.cannotEditAdmin });
            }

            const collectionsWithInstances = [
                CollectionNames.accessories,
                CollectionNames.licenses,
            ];
            let oldQuantity = 0;
            if (
                collectionsWithInstances.includes(this._collectionName) &&
                request.body.quantity !== undefined
            ) {
                const existingItem = await this._collection.findOne({ id }).lean();
                if (existingItem) {
                    oldQuantity = existingItem.quantity || 0;
                }

                const newQuantity = request.body.quantity;
                if (newQuantity < oldQuantity) {
                    const InstanceModel =
                        this._collectionName === CollectionNames.accessories
                            ? models.AccessoryInstances
                            : models.LicenseInstances;

                    const assignedCount = await InstanceModel.countDocuments({
                        parentId: Number(id),
                        status: StatusValues.assigned,
                    });

                    if (newQuantity < assignedCount) {
                        return response.status(StatusCodes.BAD_REQUEST).send({
                            message: ConstMessages.cannotDecreaseQuantity(assignedCount),
                        });
                    }
                }
            }

            let item;
            if (
                this._collectionName === CollectionNames.users &&
                request.body[FieldNames.password]
            ) {
                item = await this._collection.findOne({ id });
                if (!item) {
                    return response.status(StatusCodes.NOT_FOUND).send(ConstMessages.notExists);
                }
                Object.entries(request.body).forEach(([key, value]) => {
                    if (value === undefined || value === null) {
                        item.set(key, undefined);
                    } else {
                        item[key] = value;
                    }
                });

                await item.save();
                item = item.toObject();
            } else {
                const fieldsToSet = {};
                const fieldsToUnset = {};
                Object.entries(request.body).forEach(([key, value]) => {
                    if (value === undefined || value === null) {
                        fieldsToUnset[key] = '';
                    } else {
                        fieldsToSet[key] = value;
                    }
                });

                const updateQuery = {};
                if (Object.keys(fieldsToSet).length > 0) {
                    updateQuery[MongoOperators.set] = fieldsToSet;
                }
                if (Object.keys(fieldsToUnset).length > 0) {
                    updateQuery[MongoOperators.unset] = fieldsToUnset;
                }

                item = await this._collection
                    .findOneAndUpdate({ id }, updateQuery, { new: true, runValidators: true })
                    .lean();
                if (!item) {
                    return response.status(StatusCodes.NOT_FOUND).send(ConstMessages.notExists);
                }
            }

            if (
                collectionsWithInstances.includes(this._collectionName) &&
                request.body.quantity !== undefined
            ) {
                const newQuantity = item.quantity || 0;
                const InstanceModel =
                    this._collectionName === CollectionNames.accessories
                        ? models.AccessoryInstances
                        : models.LicenseInstances;

                if (newQuantity > oldQuantity) {
                    const instancesToAdd = newQuantity - oldQuantity;
                    for (let i = 1; i <= instancesToAdd; i++) {
                        const lastInstanceId = await getLastDocument(InstanceModel);
                        const instance = new InstanceModel({
                            id: lastInstanceId,
                            parentId: Number(id),
                            instanceNumber: oldQuantity + i,
                            status: StatusValues.available,
                        });
                        await instance.save();
                    }
                } else if (newQuantity < oldQuantity) {
                    const instancesToRemove = oldQuantity - newQuantity;
                    const availableInstances = await InstanceModel.find({
                        parentId: Number(id),
                        status: StatusValues.available,
                    })
                        .sort({ instanceNumber: -1 })
                        .limit(instancesToRemove)
                        .lean();

                    for (const instance of availableInstances) {
                        await InstanceModel.deleteOne({ id: instance.id });
                    }
                }
            }

            await logHistory(models.History, {
                resourceType: this._collectionName,
                resourceId: Number(id),
                action: HistoryActions.updated,
                metadata: { name: item.name || item.username },
            });

            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);

            if (this._collectionName === CollectionNames.users && item[FieldNames.password]) {
                delete item[FieldNames.password];
            }

            response.status(StatusCodes.OK).send(item);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async _clearReferences(collectionName, id) {
        const idNum = Number(id);

        switch (collectionName) {
            case CollectionNames.users:
                await models.Companies.updateMany(
                    { owner: idNum },
                    { [MongoOperators.unset]: { owner: '' } },
                );
                await models.Departments.updateMany(
                    { manager: idNum },
                    { [MongoOperators.unset]: { manager: '' } },
                );
                await models.Locations.updateMany({ manager: idNum }, { $unset: { manager: '' } });
                await models.Assets.updateMany(
                    { assigneeModel: ModelNames.users, assignee: idNum },
                    {
                        [MongoOperators.unset]: {
                            assigneeModel: '',
                            assignee: '',
                            actualAssigneeModel: '',
                        },
                    },
                );
                await models.Assets.updateMany(
                    {
                        assigneeModel: ModelNames.common,
                        actualAssigneeModel: ModelNames.users,
                        assignee: idNum,
                    },
                    { [MongoOperators.unset]: { assignee: '', actualAssigneeModel: '' } },
                );
                await models.AccessoryInstances.updateMany(
                    { assigneeModel: ModelNames.users, assignee: idNum },
                    {
                        [MongoOperators.unset]: {
                            assigneeModel: '',
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                await models.AccessoryInstances.updateMany(
                    {
                        assigneeModel: ModelNames.common,
                        actualAssigneeModel: ModelNames.users,
                        assignee: idNum,
                    },
                    {
                        [MongoOperators.unset]: {
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                await models.LicenseInstances.updateMany(
                    { assigneeModel: ModelNames.users, assignee: idNum },
                    {
                        [MongoOperators.unset]: {
                            assigneeModel: '',
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                await models.LicenseInstances.updateMany(
                    {
                        assigneeModel: ModelNames.common,
                        actualAssigneeModel: ModelNames.users,
                        assignee: idNum,
                    },
                    {
                        [MongoOperators.unset]: {
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                break;

            case CollectionNames.locations:
                await models.Users.updateMany({ location: idNum }, { $unset: { location: '' } });
                await models.Locations.updateMany({ parent: idNum }, { $unset: { parent: '' } });
                await models.Assets.updateMany(
                    { assigneeModel: ModelNames.locations, assignee: idNum },
                    {
                        [MongoOperators.unset]: {
                            assigneeModel: '',
                            assignee: '',
                            actualAssigneeModel: '',
                        },
                    },
                );
                await models.Assets.updateMany(
                    {
                        assigneeModel: ModelNames.common,
                        actualAssigneeModel: ModelNames.locations,
                        assignee: idNum,
                    },
                    { [MongoOperators.unset]: { assignee: '', actualAssigneeModel: '' } },
                );
                await models.AccessoryInstances.updateMany(
                    { assigneeModel: ModelNames.locations, assignee: idNum },
                    {
                        [MongoOperators.unset]: {
                            assigneeModel: '',
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                await models.AccessoryInstances.updateMany(
                    {
                        assigneeModel: ModelNames.common,
                        actualAssigneeModel: ModelNames.locations,
                        assignee: idNum,
                    },
                    {
                        [MongoOperators.unset]: {
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                await models.LicenseInstances.updateMany(
                    { assigneeModel: ModelNames.locations, assignee: idNum },
                    {
                        [MongoOperators.unset]: {
                            assigneeModel: '',
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                await models.LicenseInstances.updateMany(
                    {
                        assigneeModel: ModelNames.common,
                        actualAssigneeModel: ModelNames.locations,
                        assignee: idNum,
                    },
                    {
                        [MongoOperators.unset]: {
                            assignee: '',
                            actualAssigneeModel: '',
                            assignedAt: '',
                        },
                        [MongoOperators.set]: { status: StatusValues.available },
                    },
                );
                break;

            case CollectionNames.companies:
                await models.Users.updateMany(
                    { company: idNum },
                    { [MongoOperators.unset]: { company: '' } },
                );
                await models.Locations.updateMany(
                    { company: idNum },
                    { [MongoOperators.unset]: { company: '' } },
                );
                break;

            case CollectionNames.departments:
                await models.Users.updateMany(
                    { department: idNum },
                    { [MongoOperators.unset]: { department: '' } },
                );
                break;
        }
    }

    async deleteItem(request, response) {
        try {
            const id = validateId(request.params.id);
            if (this._collectionName === CollectionNames.users && id === config.ADMIN_USER_ID) {
                return response
                    .status(StatusCodes.FORBIDDEN)
                    .send({ message: ConstMessages.cannotDeleteAdmin });
            }

            const item = await this._collection.findOne({ id });
            if (!item) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            await this._clearReferences(this._collectionName, id);
            await models.History.deleteMany({
                resourceType: this._collectionName,
                resourceId: Number(id),
            });

            const collectionsWithInstances = [
                CollectionNames.accessories,
                CollectionNames.licenses,
            ];
            if (collectionsWithInstances.includes(this._collectionName)) {
                const InstanceModel =
                    this._collectionName === CollectionNames.accessories
                        ? models.AccessoryInstances
                        : models.LicenseInstances;
                await InstanceModel.deleteMany({ parentId: Number(id) });
            }

            await this._collection.deleteOne({ id });
            response.status(StatusCodes.ACCEPTED).send({ message: ConstMessages.actionSucceed });
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async _createInstances(parentId, quantity, collectionName) {
        const InstanceModel =
            collectionName === CollectionNames.accessories
                ? models.AccessoryInstances
                : models.LicenseInstances;

        for (let i = 1; i <= quantity; i++) {
            const lastInstanceId = await getLastDocument(InstanceModel);
            const instance = new InstanceModel({
                id: lastInstanceId,
                parentId,
                instanceNumber: i,
                status: StatusValues.available,
            });
            await instance.save();
        }
    }

    async createItem(request, response) {
        try {
            const lastId = await getLastDocument(this._collection);
            const newItem = new this._collection(request.body);
            newItem.id = lastId;
            await newItem.save();

            await logHistory(models.History, {
                resourceType: this._collectionName,
                resourceId: lastId,
                action: HistoryActions.created,
                metadata: { name: newItem.name },
            });

            const collectionsWithInstances = [
                CollectionNames.accessories,
                CollectionNames.licenses,
            ];
            if (collectionsWithInstances.includes(this._collectionName) && newItem.quantity > 0) {
                await this._createInstances(lastId, newItem.quantity, this._collectionName);
            }

            let item = await this._collection.findOne({ id: lastId }).lean();
            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);

            if (this._collectionName === CollectionNames.users && item[FieldNames.password]) {
                delete item[FieldNames.password];
            }

            response.status(StatusCodes.CREATED).send(item);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async checkIn(request, response) {
        try {
            const id = validateId(request.params.id);
            const item = await this._collection.findOne({ id });
            if (!item) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
            }

            if (!item.assignee) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: ConstMessages.resourceNotCheckedOut });
            }

            const previousAssignee = item.assignee;
            const previousAssigneeModel = item.assigneeModel;
            const previousActualAssigneeModel = item.actualAssigneeModel;
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

            let updatedItem = await this._collection
                .findOneAndUpdate(
                    { id },
                    { [MongoOperators.unset]: { assignee: '', actualAssigneeModel: '' } },
                    { new: true, runValidators: true },
                )
                .lean();

            await logHistory(models.History, {
                resourceType: this._collectionName,
                resourceId: Number(id),
                action: HistoryActions.checkin,
                metadata: {
                    name: item.name,
                    previousAssignee,
                    previousAssigneeName,
                    previousAssigneeModel,
                    previousActualAssigneeModel,
                },
            });

            updatedItem = await this._manualPopulate(updatedItem);
            updatedItem = await this._handlePolymorphicPopulate(updatedItem);
            response.status(StatusCodes.OK).send(updatedItem);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }

    async checkOut(request, response) {
        try {
            const id = validateId(request.params.id);
            const { assigneeModel, actualAssigneeModel, assignee } = request.body;
            if (!assignee || !actualAssigneeModel) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: ConstMessages.assigneeRequired });
            }

            const item = await this._collection.findOne({ id });
            if (!item) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: ConstMessages.notExists });
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

            let updatedItem = await this._collection
                .findOneAndUpdate(
                    { id },
                    {
                        [MongoOperators.set]: {
                            assigneeModel: assigneeModel || actualAssigneeModel,
                            actualAssigneeModel,
                            assignee: Number(assignee),
                        },
                    },
                    { new: true, runValidators: true },
                )
                .lean();

            await logHistory(models.History, {
                resourceType: this._collectionName,
                resourceId: Number(id),
                action: HistoryActions.checkout,
                metadata: {
                    name: item.name,
                    assigneeId: Number(assignee),
                    assigneeName,
                    assigneeModel: assigneeModel || actualAssigneeModel,
                    actualAssigneeModel,
                },
            });

            updatedItem = await this._manualPopulate(updatedItem);
            updatedItem = await this._handlePolymorphicPopulate(updatedItem);
            response.status(StatusCodes.OK).send(updatedItem);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response.status(StatusCodes.BAD_REQUEST).send({ message: errorMessage });
        }
    }
}

export default Model;
