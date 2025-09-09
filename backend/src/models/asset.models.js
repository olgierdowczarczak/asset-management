import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        assigneeModel: {
            type: String,
            required: true,
            enum: ['users', 'locations'],
        },
        assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'assigneeModel' },
    },
    { versionKey: false },
);

export default mongoose.model('assets', AssetSchema);
