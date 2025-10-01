import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import bcrypt from 'bcrypt';
import isAdmin from '../helpers/isAdmin.js';

const AutoIncrement = mongooseSequence(mongoose);
const UserSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: [true, 'User already exists'],
            immutable: true,
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
                message: 'Role must be user or admin',
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

UserSchema.methods.checkPassword = async function checkPassword(password) {
    return bcrypt.compare(password, this.password);
};
UserSchema.methods.toPublic = function toPublic() {
    const obj = this.toObject();
    delete obj._id;
    delete obj.password;
    return obj;
};
UserSchema.methods.softDelete = async function softDelete() {
    if (this.isDeleted) {
        throw new Error('User already deleted');
    }
    if (isAdmin(this)) {
        throw new Error('User cannot be deleted');
    }

    await this.updateOne({ $set: { isDeleted: true } });
};
UserSchema.methods.hardDelete = async function hardDelete() {
    if (isAdmin(this)) {
        throw new Error('User cannot be deleted');
    }

    await this.deleteOne();
};

UserSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, Number(process.env.JWT_SALT));
    } catch (err) {
        next(err);
    }
});

UserSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'users_id_counter' });

export default mongoose.model('users', UserSchema);
