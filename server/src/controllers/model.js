import { ConstMessages, CollectionNames } from 'asset-management-common/constants/index.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
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
        this._router.route('/').get(this.getItems).post(this.createItem);
        this._router
            .route('/:id')
            .get(this.getItem)
            .put(this.updateItem)
            .patch(this.updateItem)
            .delete(this.deleteItem);
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
            if (item && item.assignee && item.assigneeModel) {
                const capitalizedName =
                    item.assigneeModel.charAt(0).toUpperCase() + item.assigneeModel.slice(1);
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
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;

            const total = await this._collection.countDocuments(filters);

            let items = await this._collection.find(filters).skip(skip).limit(limitNum).lean();

            items = await this._manualPopulate(items);
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
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }

    async getItem(request, response) {
        try {
            const { id } = request.params;
            let item = await this._collection.findOne({ id }).lean();
            if (!item) {
                return response.status(StatusCodes.NOT_FOUND).send(ConstMessages.notExists);
            }
            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);
            response.status(StatusCodes.OK).send(item);
        } catch (err) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(err) || ConstMessages.internalServerError);
        }
    }

    async updateItem(request, response) {
        try {
            const { id } = request.params;
            if (this._collectionName === CollectionNames.users && Number(id) === 1) {
                return response
                    .status(StatusCodes.FORBIDDEN)
                    .send('Cannot edit the main administrator account');
            }

            let item = await this._collection
                .findOneAndUpdate(
                    { id },
                    { $set: request.body },
                    { new: true, runValidators: true },
                )
                .lean();
            if (!item) {
                return response.status(StatusCodes.NOT_FOUND).send(ConstMessages.notExists);
            }
            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);
            response.status(StatusCodes.OK).send(item);
        } catch (err) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(err) || ConstMessages.internalServerError);
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
                await models.Assets.updateMany(
                    { assigneeModel: 'users', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '' } },
                );
                await models.Accessories.updateMany(
                    { assigneeModel: 'users', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '' } },
                );
                await models.Licenses.updateMany(
                    { assigneeModel: 'users', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '' } },
                );
                break;

            case CollectionNames.locations:
                await models.Users.updateMany({ location: idNum }, { $unset: { location: '' } });
                await models.Locations.updateMany({ parent: idNum }, { $unset: { parent: '' } });
                await models.Assets.updateMany(
                    { assigneeModel: 'locations', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '' } },
                );
                await models.Accessories.updateMany(
                    { assigneeModel: 'locations', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '' } },
                );
                await models.Licenses.updateMany(
                    { assigneeModel: 'locations', assignee: idNum },
                    { $unset: { assigneeModel: '', assignee: '' } },
                );
                break;

            case CollectionNames.companies:
                await models.Users.updateMany({ company: idNum }, { $unset: { company: '' } });
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
            const { id } = request.params;
            if (this._collectionName === CollectionNames.users && Number(id) === 1) {
                return response
                    .status(StatusCodes.FORBIDDEN)
                    .send('Cannot delete the main administrator account');
            }

            const item = await this._collection.findOne({ id });
            if (!item) {
                return response.status(StatusCodes.NOT_FOUND).send(ConstMessages.notExists);
            }

            await this._clearReferences(this._collectionName, id);

            await this._collection.deleteOne({ id });
            response.status(StatusCodes.ACCEPTED).send(ConstMessages.actionSucceed);
        } catch (err) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(err) || ConstMessages.internalServerError);
        }
    }

    async createItem(request, response) {
        try {
            const lastId = await getLastDocument(this._collection);
            const newItem = new this._collection(request.body);
            newItem.id = lastId;
            await newItem.save();
            let item = await this._collection.findOne({ id: lastId }).lean();
            item = await this._manualPopulate(item);
            item = await this._handlePolymorphicPopulate(item);
            response.status(StatusCodes.CREATED).send(item);
        } catch (err) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .send(validateError(err) || ConstMessages.internalServerError);
        }
    }
}

export default Model;
