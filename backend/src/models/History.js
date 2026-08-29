// Copy the code above for History.js
// backend/src/models/History.js
import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['created', 'updated', 'deleted', 'reviewed', 'analyzed', 'completed'],
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster queries
historySchema.index({ projectId: 1, createdAt: -1 });
historySchema.index({ userId: 1, createdAt: -1 });
historySchema.index({ reviewId: 1 });

const History = mongoose.model('History', historySchema);

export default History;