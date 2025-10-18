import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import Endpoint from './endpoint.js';
import validateError from '../lib/helpers/validateError.js';
import getModelByName from '../lib/helpers/getModelByName.js';

class Model extends Endpoint {
    constructor(endpoint) {
        super();
        this._collection = getModelByName(endpoint);

        this.getItems = this.getItems.bind(this);
        this.createItem = this.createItem.bind(this);
        this.getItem = this.getItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async getItems(request, response) {
        try {
            const items = await this._collection.find(request.body);

            response.status(ConstCodes.ok).send(items);
        } catch (error) {
            response
                .status(ConstCodes.badRequest)
                .send(validateError(error) || ConstMessages.internalServerError);
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async getItem(request, response) {
        try {
            const { id } = request.params;
            const item = await this._collection.findOne({ id });

            if (!item) {
                return response.status(ConstCodes.notFound).send(ConstMessages.notExists);
            }

            response.status(ConstCodes.ok).send(item);
        } catch (err) {
            response
                .status(ConstCodes.badRequest)
                .send(validateError(err) || ConstMessages.internalServerError);
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async updateItem(request, response) {
        try {
            const { id } = request.params;
            const item = await this._collection.findOneAndUpdate(
                { id },
                { $set: request.body },
                { new: true, runValidators: true },
            );

            if (!item) {
                return response.status(ConstCodes.notFound).send(ConstMessages.notExists);
            }

            response.status(ConstCodes.ok).send(item);
        } catch (err) {
            response
                .status(ConstCodes.badRequest)
                .send(validateError(err) || ConstMessages.internalServerError);
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async deleteItem(request, response) {
        try {
            const { id } = request.params;
            const item = await this._collection.findOne({ id });

            if (!item) {
                return response.status(ConstCodes.notFound).send(ConstMessages.notExists);
            }
            await this._collection.deleteOne({ id });

            response.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
        } catch (err) {
            response
                .status(ConstCodes.badRequest)
                .send(validateError(err) || ConstMessages.internalServerError);
        }
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    async createItem(request, response) {
        try {
            const lastId = await getLastDocument(this._collection);
            const item = new this._collection(request.body);
            item.id = lastId;

            await item.save();

            response.status(ConstCodes.created).send(item);
        } catch (err) {
            response
                .status(ConstCodes.badRequest)
                .send(validateError(err) || ConstMessages.internalServerError);
        }
    }
}

export default Model;
