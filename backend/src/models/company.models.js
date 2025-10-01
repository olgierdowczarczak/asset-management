import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);
const CompanySchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: [true, 'Company already exists'],
            immutable: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: [true, 'Name already exists'],
            minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
    },
    { versionKey: false },
);

CompanySchema.methods.toPublic = function toPublic() {
    const obj = this.toObject();
    delete obj._id;
    return obj;
};
CompanySchema.methods.hardDelete = async function hardDelete() {
    await this.deleteOne();
};

CompanySchema.plugin(AutoIncrement, { inc_field: 'id', id: 'companies_id_counter' });

export default mongoose.model('companies', CompanySchema);
