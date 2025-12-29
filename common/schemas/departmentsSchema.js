import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name already exists'],
        minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
        maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
    },
    manager: {
        type: mongoose.Schema.Types.Number,
        ref: 'users',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    id: {
        type: Number,
        unique: [true, 'Department already exists'],
        immutable: true,
    }
}, { versionKey: false });

export default schema;
