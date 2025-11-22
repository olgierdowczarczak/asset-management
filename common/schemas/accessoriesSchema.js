import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
        maxlength: [31, 'Name is longer than the maximum allowed length (31)']
    },
    cost: {
        type: Number,
        min: [0, 'Cost must be a positive number'],
    },
    quantity: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    id: {
        type: Number,
        unique: [true, 'Accessory already exists'],
        immutable: true,
    },
}, { versionKey: false });

export default schema;
