import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);
const AccessorieSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: [true, 'Accessorie already exists'],
            immutable: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: [true, 'Name already exists'],
            minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { versionKey: false },
);

AccessorieSchema.methods.toPublic = function () {
    const obj = this.toObject();
    delete obj._id;
    return obj;
};
AccessorieSchema.methods.hardDelete = async function () {
    await this.deleteOne();
};

AccessorieSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'accessories_id_counter' });

export default mongoose.model('accessories', AccessorieSchema);
