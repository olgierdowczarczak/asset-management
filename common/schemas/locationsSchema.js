import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name already exists'],
        minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
        maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
    },
    city: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || v.length >= 2;
            },
            message: 'City is shorter than the minimum allowed length (2)',
        },
        maxlength: [63, 'City is longer than the maximum allowed length (63)'],
    },
    address: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || v.length >= 2;
            },
            message: 'Address is shorter than the minimum allowed length (2)',
        },
        maxlength: [127, 'Address is longer than the maximum allowed length (127)'],
    },
    parent: {
        type: mongoose.Schema.Types.Number,
        ref: 'locations',
    },
    manager: {
        type: mongoose.Schema.Types.Number,
        ref: 'users',
    },
    company: {
        type: mongoose.Schema.Types.Number,
        ref: 'companies',
    },
    id: {
        type: Number,
        unique: [true, 'Location already exists'],
        immutable: true,
    }
}, { versionKey: false });

export default schema;
