import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name already exists'],
        minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
        maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
    },
    id: {
        type: Number,
        unique: [true, 'License already exists'],
        immutable: true,
    }
}, { versionKey: false });

export default schema;
