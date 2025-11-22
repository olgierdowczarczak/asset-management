import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name already exists'],
        minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
        maxlength: [63, 'Name is longer than the maximum allowed length (63)'],
    },
    id: {
        type: Number,
        unique: [true, 'Job title already exists'],
        immutable: true,
    }
}, { versionKey: false });

export default schema;
