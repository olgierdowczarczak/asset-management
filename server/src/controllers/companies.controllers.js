import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import { Companies } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getCompanies(req, res) {
    try {
        const companies = await Companies.find(req.body);

        res.status(ConstCodes.ok).send(companies);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getCompany(req, res) {
    try {
        const { id } = req.params;
        const company = await Companies.findOne({ id });

        if (!company) {
            return res.status(ConstCodes.notFound).send(ConstMessages.companyNotExists);
        }

        res.status(ConstCodes.ok).send(company);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function updateCompany(req, res) {
    try {
        const { id } = req.params;
        const company = await Companies.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!company) {
            return res.status(ConstCodes.notFound).send(ConstMessages.companyNotExists);
        }

        res.status(ConstCodes.ok).send(company);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function deleteCompany(req, res) {
    try {
        const { id } = req.params;
        const company = await Companies.findOne({ id });

        if (!company) {
            return res.status(ConstCodes.notFound).send(ConstMessages.companyNotExists);
        }
        await Companies.deleteOne({ id });

        res.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function createCompany(req, res) {
    try {
        const lastId = await getLastDocument(Companies);
        const company = new Companies(req.body);
        company.id = lastId;

        await company.save();

        res.status(ConstCodes.created).send(company);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
