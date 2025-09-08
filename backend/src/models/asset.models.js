import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
}, { versionKey: false });

export default mongoose.model('assets', AssetSchema);