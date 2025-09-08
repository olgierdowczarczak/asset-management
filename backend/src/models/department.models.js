import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { versionKey: false });

export default mongoose.model('departments', DepartmentSchema);