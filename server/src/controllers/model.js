import { ConstMessages, CollectionNames } from 'asset-management-common/constants/index.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import logHistory from 'asset-management-common/helpers/logHistory.js';
import { StatusCodes } from 'http-status-codes';
import Endpoint from './endpoint.js';
import validateError from '../lib/helpers/validateError.js';
import getModelByName from '../lib/helpers/getModelByName.js';
import getPopulateFields from '../lib/helpers/getPopulateFields.js';

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
            .route('/:id')
            .get(this.getItem)
            .put(this.updateItem)
            .patch(this.updateItem)
            .delete(this.deleteItem);

        const supportsCheckInOut = [
            CollectionNames.assets,
            CollectionNames.accessories,
            CollectionNames.licenses,
        ];

        if (supportsCheckInOut.includes(endpoint)) {
            this._router.route('/:id/checkin').post(this.checkIn);
            this._router.route('/:id/checkout').post(this.checkOut);
        }
    }

    async _manualPopulate(items) {
        const { models } = await import('../lib/models/index.js');
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
        const collectionsWithPolymorphic = [
            CollectionNames.assets,
            CollectionNames.accessories,
            CollectionNames.licenses,
        ];

        if (!collectionsWithPolymorphic.includes(this._collectionName)) {
            return items;
        }

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

    async getItems(request, response) {
        try {
            const { page = 1, limit = 10 } = request.query;
            const filters = request.body || {};
            const collectionsWithSoftDelete = [
                CollectionNames.assets,
                CollectionNames.accessories,
                CollectionNames.licenses,
            ];

            if (collectionsWithSoftDelete.includes(this._collectionName)) {
                filters.isDeleted = { $ne: true };
            }

            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            const total = await this._collection.countDocuments(filters);
            let items = await this._collection.find(filters).skip(skip).limit(limitNum).lean();
            items = await this._manualPopulate(items);
            items = await this._handlePolymorphicPopulate(items);

            if (this._collectionName === CollectionNames.users) {
                items = items.map(item => {
                    if (item.password) {
                        delete item.password;
                    }
                    return item;
                });
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
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: errorMessage });
        }
    }

    async getItem(request, response) {
        try {
            const { id } = request.params;
            let item = await this._collection.findOne({ id }).lean();
            if (!item) {
                return response.status(StatusCodes.NOT_FOUND).send({ message: ConstMessages.notExists });
            }
            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);

            if (this._collectionName === CollectionNames.users && item.password) {
                delete item.password;
            }

            response.status(StatusCodes.OK).send(item);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: errorMessage });
        }
    }

    async updateItem(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const { id } = request.params;
            if (this._collectionName === CollectionNames.users && Number(id) === 1) {
                return response
                    .status(StatusCodes.FORBIDDEN)
                    .send({ message: 'Cannot edit the main administrator account' });
            }

            let item;
            if (this._collectionName === CollectionNames.users && request.body.password) {
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
                    updateQuery.$set = fieldsToSet;
                }
                if (Object.keys(fieldsToUnset).length > 0) {
                    updateQuery.$unset = fieldsToUnset;
                }

                item = await this._collection
                    .findOneAndUpdate(
                        { id },
                        updateQuery,
                        { new: true, runValidators: true },
                    )
                    .lean();
                if (!item) {
                    return response.status(StatusCodes.NOT_FOUND).send(ConstMessages.notExists);
                }
            }

            await logHistory(models.History, {
                resourceType: this._collectionName,
                resourceId: Number(id),
                action: 'updated',
                metadata: { name: item.name || item.username },
            });

            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);

            if (this._collectionName === CollectionNames.users && item.password) {
                delete item.password;
            }

            response.status(StatusCodes.OK).send(item);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: errorMessage });
        }
    }

    async _clearReferences(collectionName, id) {
        const { models } = await import('../lib/models/index.js');
        const idNum = Number(id);

        switch (collectionName) {
            case CollectionNames.users:
                await models.Companies.updateMany({ owner: idNum }, { $unset: { owner: '' } });
                await models.Departments.updateMany(
                    { manager: idNum },
                    { $unset: { manager: '' } },
                );
                await models.Locations.updateMany(
                    { manager: idNum },
                    { $unset: { manager: '' } },
                );
                await models.Assets.updateMany(
                    { assigneeModel: 'users', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '', actualAssigneeModel: '' } },
                );
                await models.Accessories.updateMany(
                    { assigneeModel: 'users', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '', actualAssigneeModel: '' } },
                );
                await models.Licenses.updateMany(
                    { assigneeModel: 'users', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '', actualAssigneeModel: '' } },
                );
                await models.Assets.updateMany(
                    { assigneeModel: 'common', actualAssigneeModel: 'users', assignee: idNum },
                    { $unset: { assignee: '', actualAssigneeModel: '' } },
                );
                await models.Accessories.updateMany(
                    { assigneeModel: 'common', actualAssigneeModel: 'users', assignee: idNum },
                    { $unset: { assignee: '', actualAssigneeModel: '' } },
                );
                await models.Licenses.updateMany(
                    { assigneeModel: 'common', actualAssigneeModel: 'users', assignee: idNum },
                    { $unset: { assignee: '', actualAssigneeModel: '' } },
                );
                break;

            case CollectionNames.locations:
                await models.Users.updateMany({ location: idNum }, { $unset: { location: '' } });
                await models.Locations.updateMany({ parent: idNum }, { $unset: { parent: '' } });
                await models.Assets.updateMany(
                    { assigneeModel: 'locations', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '', actualAssigneeModel: '' } },
                );
                await models.Accessories.updateMany(
                    { assigneeModel: 'locations', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '', actualAssigneeModel: '' } },
                );
                await models.Licenses.updateMany(
                    { assigneeModel: 'locations', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '', actualAssigneeModel: '' } },
                );
                await models.Assets.updateMany(
                    { assigneeModel: 'common', actualAssigneeModel: 'locations', assignee: idNum },
                    { $unset: { assignee: '', actualAssigneeModel: '' } },
                );
                await models.Accessories.updateMany(
                    { assigneeModel: 'common', actualAssigneeModel: 'locations', assignee: idNum },
                    { $unset: { assignee: '', actualAssigneeModel: '' } },
                );
                await models.Licenses.updateMany(
                    { assigneeModel: 'common', actualAssigneeModel: 'locations', assignee: idNum },
                    { $unset: { assignee: '', actualAssigneeModel: '' } },
                );
                break;

            case CollectionNames.companies:
                await models.Users.updateMany({ company: idNum }, { $unset: { company: '' } });
                await models.Locations.updateMany({ company: idNum }, { $unset: { company: '' } });
                break;

            case CollectionNames.departments:
                await models.Users.updateMany(
                    { department: idNum },
                    { $unset: { department: '' } },
                );
                break;
        }
    }

    async deleteItem(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const { id } = request.params;
            if (this._collectionName === CollectionNames.users && Number(id) === 1) {
                return response
                    .status(StatusCodes.FORBIDDEN)
                    .send({ message: 'Cannot delete the main administrator account' });
            }

            const item = await this._collection.findOne({ id });
            if (!item) {
                return response.status(StatusCodes.NOT_FOUND).send({ message: ConstMessages.notExists });
            }

            await this._clearReferences(this._collectionName, id);
            await models.History.deleteMany({
                resourceType: this._collectionName,
                resourceId: Number(id),
            });

            await this._collection.deleteOne({ id });
            response.status(StatusCodes.ACCEPTED).send({ message: ConstMessages.actionSucceed });
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: errorMessage });
        }
    }

    async createItem(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const lastId = await getLastDocument(this._collection);
            const newItem = new this._collection(request.body);
            newItem.id = lastId;
            await newItem.save();

            await logHistory(models.History, {
                resourceType: this._collectionName,
                resourceId: lastId,
                action: 'created',
                metadata: { name: newItem.name },
            });

            let item = await this._collection.findOne({ id: lastId }).lean();
            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);

            if (this._collectionName === CollectionNames.users && item.password) {
                delete item.password;
            }

            response.status(StatusCodes.CREATED).send(item);
        } catch (err) {
            const errorMessage = validateError(err) || ConstMessages.internalServerError;
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: errorMessage });
        }
    }

    async checkIn(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const { id } = request.params;
            const item = await this._collection.findOne({ id });
            if (!item) {
                return response.status(StatusCodes.NOT_FOUND).send({ message: ConstMessages.notExists });
            }

            if (!item.assignee) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: 'Resource is not checked out' });
            }

            const previousAssignee = item.assignee;
            const previousAssigneeModel = item.assigneeModel;
            const previousActualAssigneeModel = item.actualAssigneeModel;
            let previousAssigneeName = '';
            if (previousAssignee) {
                const actualModel = previousAssigneeModel === 'common' ? previousActualAssigneeModel : previousAssigneeModel;
                if (actualModel) {
                    const capitalizedModel = actualModel.charAt(0).toUpperCase() + actualModel.slice(1);
                    const AssigneeModel = models[capitalizedModel];
                    if (AssigneeModel) {
                        const assigneeDoc = await AssigneeModel.findOne({ id: previousAssignee }).lean();
                        if (assigneeDoc) {
                            if (actualModel === 'users') {
                                previousAssigneeName = [assigneeDoc.firstName, assigneeDoc.middleName, assigneeDoc.lastName]
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
                    { $unset: { assignee: '', actualAssigneeModel: '' } },
                    { new: true, runValidators: true },
                )
                .lean();

            await logHistory(models.History, {
                resourceType: this._collectionName,
                resourceId: Number(id),
                action: 'checkin',
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
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: errorMessage });
        }
    }

    async checkOut(request, response) {
        try {
            const { models } = await import('../lib/models/index.js');
            const { id } = request.params;
            const { assigneeModel, actualAssigneeModel, assignee } = request.body;
            if (!assignee || !actualAssigneeModel) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: 'assignee and actualAssigneeModel are required' });
            }

            const item = await this._collection.findOne({ id });
            if (!item) {
                return response.status(StatusCodes.NOT_FOUND).send({ message: ConstMessages.notExists });
            }

            const capitalizedModel = actualAssigneeModel.charAt(0).toUpperCase() + actualAssigneeModel.slice(1);
            const AssigneeModel = models[capitalizedModel];
            if (!AssigneeModel) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: `Invalid assignee model: ${actualAssigneeModel}` });
            }

            const assigneeExists = await AssigneeModel.findOne({ id: Number(assignee) }).lean();
            if (!assigneeExists) {
                return response
                    .status(StatusCodes.NOT_FOUND)
                    .send({ message: `Assignee with id ${assignee} not found in ${actualAssigneeModel}` });
            }

            let assigneeName = '';
            if (actualAssigneeModel === 'users') {
                assigneeName = [assigneeExists.firstName, assigneeExists.middleName, assigneeExists.lastName]
                    .filter(Boolean)
                    .join(' ');
            } else {
                assigneeName = assigneeExists.name || '';
            }

            let updatedItem = await this._collection
                .findOneAndUpdate(
                    { id },
                    {
                        $set: {
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
                action: 'checkout',
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
            response
                .status(StatusCodes.BAD_REQUEST)
                .send({ message: errorMessage });
        }
    }
}

export default Model;
