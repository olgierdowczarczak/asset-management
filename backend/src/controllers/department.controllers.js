import Department from '../models/department.models.js';

const meta = {
    columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Name', type: 'string' }
    ]
};

export async function getDepartment(req, res) {
    try {
        const department = await Department.findOne({ id: req.params.id });
        if (!department) {
            return res.status(404).json({ message: 'Department not exists' });
        }

        res.json({ meta, total: 1, data: department.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function updateDepartment(req, res) {
    try {
        const department = await Department.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true },
        );

        if (!department) {
            return res.status(404).json({ message: 'Department not exists' });
        }

        res.json({ meta, total: 1, data: department.toPublic() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function deleteDepartment(req, res) {
    try {
        const department = await Department.findOne({ id: req.params.id });
        if (!department) {
            return res.status(404).json({ message: 'Department not exists' });
        }

        await department.hardDelete();
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function getDepartments(req, res) {
    try {
        const departments = await Department.find(req.body);
        res.json({ meta, total: 1, data: departments.map((department) => department.toPublic()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

export async function createDepartment(req, res) {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json({ meta, total: 1, data: department.toPublic() });
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
