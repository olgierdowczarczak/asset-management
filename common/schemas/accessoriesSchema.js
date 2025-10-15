import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 31
    },
    quantity: {
        type: Number,
        default: 0
    },
    id: {
        type: Number,
        unique: true,
        immutable: true
    },
}, { versionKey: false });

export default schema;
