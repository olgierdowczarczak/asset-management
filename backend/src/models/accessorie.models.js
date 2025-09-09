import mongoose from 'mongoose';

const AccessorieSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
    },
    { versionKey: false },
);

export default mongoose.model('accessories', AccessorieSchema);
