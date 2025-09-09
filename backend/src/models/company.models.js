import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    },
    { versionKey: false },
);

export default mongoose.model('companies', CompanySchema);
