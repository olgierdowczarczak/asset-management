import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    id: {
        type: Number,
        unique: [true, 'Location already exists'],
        immutable: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name already exists'],
        minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
        maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
    },
    parent: {
        type: mongoose.Schema.Types.Number,
        ref: 'locations',
    },
}, { versionKey: false });

export default schema;
