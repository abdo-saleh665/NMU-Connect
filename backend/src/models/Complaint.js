/**
 * Complaint Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const complaintSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    titleAr: String,
    description: {
        type: String,
        required: true
    },
    descriptionAr: String,
    type: {
        type: String,
        enum: ['university', 'faculty'],
        default: 'university'
    },
    category: {
        type: String,
        enum: ['facilities', 'it', 'housing', 'services', 'academic', 'other'],
        default: 'other'
    },
    // For faculty complaints
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subject: String,
    subjectAr: String,
    status: {
        type: String,
        enum: ['open', 'under_review', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    votes: {
        up: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        down: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    comments: [commentSchema],
    attachments: [{
        filename: String,
        url: String,
        type: String
    }],
    resolvedAt: Date,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolution: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for vote count
complaintSchema.virtual('voteCount').get(function() {
    return (this.votes?.up?.length || 0) - (this.votes?.down?.length || 0);
});

// Virtual for comment count
complaintSchema.virtual('commentCount').get(function() {
    return this.comments?.length || 0;
});

// Index for searching
complaintSchema.index({ title: 'text', description: 'text' });
complaintSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
