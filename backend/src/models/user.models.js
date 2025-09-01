import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    id: { type: Number, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { versionKey: false });

userSchema.methods.checkPassword = async function (password) { return bcrypt.compare(password, this.password); };
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, Number(process.env.JWT_SALT));
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model('users', userSchema);