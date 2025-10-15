import ConstMessages from 'asset-management-common/constants/constMessages.js';
import ConstCodes from 'asset-management-common/constants/constCodes.js';
import getLastDocument from 'asset-management-common/helpers/getLastDocument.js';
import { Departments } from '../lib/collections/index.js';
import validateError from '../lib/helpers/validateError.js';

export async function getDepartments(req, res) {
    try {
        const departments = await Departments.find(req.body);

        res.status(ConstCodes.ok).send(departments);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function getDepartment(req, res) {
    try {
        const { id } = req.params;
        const department = await Departments.findOne({ id });

        if (!department) {
            return res.status(ConstCodes.notFound).send(ConstMessages.departmentNotExists);
        }

        res.status(ConstCodes.ok).send(department);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function updateDepartment(req, res) {
    try {
        const { id } = req.params;
        const department = await Departments.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!department) {
            return res.status(ConstCodes.notFound).send(ConstMessages.departmentNotExists);
        }

        res.status(ConstCodes.ok).send(department);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function deleteDepartment(req, res) {
    try {
        const { id } = req.params;
        const department = await Departments.findOne({ id });

        if (!department) {
            return res.status(ConstCodes.notFound).send(ConstMessages.departmentNotExists);
        }
        await Departments.deleteOne({ id });

        res.status(ConstCodes.deleted).send(ConstMessages.actionSucceed);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}

export async function createDepartment(req, res) {
    try {
        const lastId = await getLastDocument(Departments);
        const department = new Departments(req.body);
        department.id = lastId;

        await department.save();

        res.status(ConstCodes.created).send(department);
    } catch (err) {
        res.status(ConstCodes.badRequest).send(
            validateError(err) || ConstMessages.internalServerError,
        );
    }
}
