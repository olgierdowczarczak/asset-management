import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);
const LicenseSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: [true, 'License already exists'],
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
            required: [true, 'Quantity is required'],
        },
    },
    { versionKey: false },
);

LicenseSchema.methods.toPublic = function () {
    const obj = this.toObject();
    delete obj._id;
    return obj;
};
LicenseSchema.methods.hardDelete = async function () {
    await this.deleteOne();
};

LicenseSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'licenses_id_counter' });

export default mongoose.model('licenses', LicenseSchema);
