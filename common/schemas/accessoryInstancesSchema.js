import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    parentId: {
        type: Number,
        required: [true, 'Parent ID is required'],
        ref: 'accessories',
    },
    instanceNumber: {
        type: Number,
        required: [true, 'Instance number is required'],
    },
    status: {
        type: String,
        enum: ['available', 'assigned'],
        default: 'available',
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
    assignedAt: {
        type: Date,
    },
    id: {
        type: Number,
        unique: [true, 'Accessory instance already exists'],
        immutable: true,
    },
}, { versionKey: false });

export default schema;
