import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);
const AssetSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: [true, 'Asset already exists'],
            immutable: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: [true, 'Name already exists'],
            minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        assigneeModel: {
            type: String,
            required: true,
            enum: ['users', 'locations'],
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'assigneeModel',
        },
    },
    { versionKey: false },
);

AssetSchema.methods.toPublic = function () {
    const obj = this.toObject();
    delete obj._id;
    return obj;
};
AssetSchema.methods.softDelete = async function () {
    if (this.isDeleted) {
        throw new Error('Asset already deleted');
    }

    await this.updateOne({ $set: { isDeleted: true } });
};
AssetSchema.methods.hardDelete = async function () {
    await this.deleteOne();
};

AssetSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'assets_id_counter' });

export default mongoose.model('assets', AssetSchema);
