import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String },
    is_admin: { type: Boolean },
    is_deleted: { type: Boolean }
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