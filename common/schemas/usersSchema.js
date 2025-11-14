import mongoose from 'mongoose';
import encryptData from '../helpers/encryptData.js';

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [2, 'Username is shorter than the minimum allowed length (2)'],
        maxlength: [31, 'Username is longer than the maximum allowed length (31)'],
    },
    password: {
        type: String,
        minlength: [8, 'Password is shorter than the minimum allowed length (8)'],
        maxlength: [64, 'Password is longer than the maximum allowed length (64)'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid form'],
        maxlength: [127, 'Email is longer than the maximum allowed length (127)'],
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
        type: mongoose.Schema.Types.Number,
        ref: 'locations',
    },
    company: {
        type: mongoose.Schema.Types.Number,
        ref: 'companies',
    },
    department: {
        type: mongoose.Schema.Types.Number,
        ref: 'departments',
    },
    isRemote: {
        type: Boolean,
    },
    isRemembered: {
        type: Boolean,
    },
    isDeleted: {
        type: Boolean,
    },
    id: {
        type: Number,
        unique: [true, 'User already exists'],
        immutable: true,
    },
}, { versionKey: false });

schema.pre('save', async function save(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        this.password = await encryptData(this.password);
        return next();
    } catch (err) {
        return next(err);
    }
});

export default schema;
