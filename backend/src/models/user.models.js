import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: [true, 'User already exists'],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: [true, 'User already exists'],
            minlength: [2, 'Username is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Username is longer than the maximum allowed length (31)'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Password is longer than the maximum allowed length (31)'],
            select: false,
        },
        email: {
            type: String,
            required: true,
            unique: [true, 'Password is required'],
            match: [/^\S+@\S+\.\S+$/, 'Invalid form'],
            maxlength: [31, 'Email is longer than the maximum allowed length (31)'],
        },
        firstName: {
            type: String,
            required: [true, 'Firstname is required'],
            minlength: [2, 'Firstname is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Firstname is longer than the maximum allowed length (31)'],
        },
        lastName: {
            type: String,
            required: [true, 'Lastname is required'],
            minlength: [2, 'Lastname is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Lastname is longer than the maximum allowed length (31)'],
        },
        middleName: {
            type: String,
            minlength: [2, 'Middlename is shorter than the minimum allowed length (2)'],
            maxlength: [31, 'Middlename is longer than the maximum allowed length (31)'],
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'Role must be either user or admin',
            },
            default: 'user',
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'locations',
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'departments',
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'departments',
        },
        isRemote: {
            type: Boolean,
        },
        isDeleted: {
            type: Boolean,
        },
    },
    { versionKey: false },
);

UserSchema.methods.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, Number(process.env.JWT_SALT));
    } catch (err) {
        next(err);
    }
});

export default mongoose.model('users', UserSchema);
