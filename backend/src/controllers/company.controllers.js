import Company from '../models/company.models.js';

export async function getCompany(req, res) {
    try {
        const company = await Company.findOne({ id: req.params.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not exists' });
        }

        res.send(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function updateCompany(req, res) {
    try {
        const company = await Company.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!company) {
            return res.status(404).json({ message: 'Company not exists' });
        }

        res.send(company.toPublic());
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function deleteCompany(req, res) {
    try {
        const company = await Company.findOne({ id: req.params.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not exists' });
        }

        await company.hardDelete();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getCompanies(req, res) {
    try {
        const companies = await Company.find(req.body);
        res.send(companies.map((company) => company.toPublic()));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function createCompany(req, res) {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).send(company.toPublic());
    } catch (err) {
        console.error(err);
        switch (err.name) {
            case 'MongoServerError': {
                if (err.code === 11000) {
                    return res.status(400).json({
                        message: `Duplicate field: ${Object.keys(err.keyPattern).join(', ')}`,
                    });
                }
                return res.status(400).json({ message: err.message });
            }
            case 'MongooseError':
                return res.status(400).json({ message: err.message });
            case 'ValidationError': {
                const errors = Object.values(err.errors).map((e) => e.message);
                return res.status(400).json({ message: errors[0] });
            }
            default:
                return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
