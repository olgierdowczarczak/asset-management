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
        get: v => v ? parseFloat(v.toFixed(2)) : v,
        set: v => v ? parseFloat(v) : v,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    assigneeModel: {
        type: String,
        enum: ['users', 'locations', 'common'],
    },
    actualAssigneeModel: {
        type: String,
        enum: ['users', 'locations'],
    },
    assignee: {
        type: mongoose.Schema.Types.Number,
        ref: 'actualAssigneeModel',
    },
    id: {
        type: Number,
        unique: [true, 'Asset already exists'],
        immutable: true,
    }
}, { versionKey: false, toJSON: { getters: true }, toObject: { getters: true } });

export default schema;
