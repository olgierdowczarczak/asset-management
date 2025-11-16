import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    resourceType: {
        type: String,
        required: [true, 'Resource type is required'],
        enum: ['assets', 'accessories', 'licenses', 'users', 'companies', 'departments', 'locations'],
    },
    resourceId: {
        type: Number,
        required: [true, 'Resource ID is required'],
    },
    action: {
        type: String,
        required: [true, 'Action is required'],
        enum: ['created', 'updated', 'checkin', 'checkout', 'deleted'],
    },
    performedBy: {
        type: Number,
        ref: 'users',
    },
    changes: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    id: {
        type: Number,
        unique: [true, 'History entry already exists'],
        immutable: true,
    },
}, { versionKey: false });

export default schema;
