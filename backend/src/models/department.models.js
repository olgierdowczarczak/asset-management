import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);
const DepartmentSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: [true, 'Department already exists'],
            immutable: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: [true, 'Name already exists'],
            minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
    },
    { versionKey: false },
);

DepartmentSchema.methods.toPublic = function toPublic() {
    const obj = this.toObject();
    delete obj._id;
    return { id: obj.id, ...obj };
};
DepartmentSchema.methods.hardDelete = async function hardDelete() {
    await this.deleteOne();
};

DepartmentSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'departments_id_counter' });

export default mongoose.model('departments', DepartmentSchema);
