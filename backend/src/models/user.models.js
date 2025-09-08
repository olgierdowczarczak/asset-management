import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    role: { type: String, default: 'user' },
    location: { type: String },
    company: { type: String },
    department: { type: String },
    isRemote: { type: Boolean },
    isDeleted: { type: Boolean }
}, { versionKey: false });

UserSchema.methods.checkPassword = async function (password) { return bcrypt.compare(password, this.password); };
UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, Number(process.env.JWT_SALT));
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model('users', UserSchema);