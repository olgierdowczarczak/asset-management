import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    accessorieId: {
        type: Number,
        unique: true,
        immutable: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 31
    },
    quantity: {
        type: Number,
        default: 0
    }
});

export default schema;
