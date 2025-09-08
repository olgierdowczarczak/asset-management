import Company from '../models/company.models.js';

export async function getCompany(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const company = await Company.findOne({ id }).select('-_id');
        if (!company) return res.status(404).json({ message: 'Company not exists' });
        res.send(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function updateCompany(req, res) {
    try {
        const params = req.params;
        const body = req.body;
        const { id } = params;
        delete body._id;
        delete body.id;
        const company = await Company.findOneAndUpdate({ id }, { $set: body }, {
            new: true,
            runValidators: true
        }).select('-_id');

        if (!company) return res.status(404).json({ message: 'Company not exists' });
        res.send(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function deleteCompany(req, res) {
    try {
        const params = req.params;
        const { id } = params
        const company = await Company.findOne({ id });
        if (!company) return res.status(404).json({ message: 'Company not exists' });

        await Company.deleteOne({ id });
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getCompanies(req, res) {
    try {
        const body = req.body;
        const companies = await Company.find(body).select('-_id');
        res.send(companies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function createCompany(req, res) {
    try {
        const body = req.body;
        const lastAsset = await Company.findOne().sort({ id: -1 }).exec();
        const id = lastAsset?.id + 1 || 1;
        const company = new Company({ id, ...body });
        await company.save();

        let assetObj = company.toObject();
        delete assetObj._id;

        res.status(201).send(assetObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};