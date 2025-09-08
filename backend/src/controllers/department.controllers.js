import Department from '../models/department.models.js';

export async function getDepartment(req, res) {
    try {
        const params = req.params;
        const { id } = params;
        const department = await Department.findOne({ id }).select('-_id');
        if (!department) return res.status(404).json({ message: 'Department not exists' });
        res.send(department);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function updateDepartment(req, res) {
    try {
        const params = req.params;
        const body = req.body;
        const { id } = params;
        delete body._id;
        delete body.id;
        const department = await Department.findOneAndUpdate({ id }, { $set: body }, {
            new: true,
            runValidators: true
        }).select('-_id');

        if (!department) return res.status(404).json({ message: 'Department not exists' });
        res.send(department);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function deleteDepartment(req, res) {
    try {
        const params = req.params;
        const { id } = params
        const department = await Department.findOne({ id });
        if (!department) return res.status(404).json({ message: 'Department not exists' });

        await Department.deleteOne({ id });
        res.status(202).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function getDepartments(req, res) {
    try {
        const body = req.body;
        const departments = await Department.find(body).select('-_id');
        res.send(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export async function createDepartment(req, res) {
    try {
        const body = req.body;
        const lastAsset = await Department.findOne().sort({ id: -1 }).exec();
        const id = lastAsset?.id + 1 || 1;
        const department = new Department({ id, ...body });
        await department.save();

        let assetObj = department.toObject();
        delete assetObj._id;

        res.status(201).send(assetObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};