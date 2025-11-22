import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name already exists'],
        minlength: [2, 'Name is shorter than the minimum allowed length (2)'],
        maxlength: [31, 'Name is longer than the maximum allowed length (31)'],
    },
    cost: {
        type: Number,
        min: [0, 'Cost must be a positive number'],
    },
    costType: {
        type: String,
        enum: {
            values: ['per_license', 'total'],
            message: 'Cost type must be per_license or total',
        },
    },
    billingPeriod: {
        type: String,
        enum: {
            values: ['monthly', 'yearly'],
            message: 'Billing period must be monthly or yearly',
        },
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    id: {
        type: Number,
        unique: [true, 'License already exists'],
        immutable: true,
    }
}, { versionKey: false });

export default schema;
