import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'locations' },
    },
    { versionKey: false },
);

export default mongoose.model('locations', LocationSchema);
