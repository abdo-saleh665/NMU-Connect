/**
 * LostItem Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    titleAr: String,
    description: { type: String, required: true },
    descriptionAr: String,
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    category: {
        type: String,
        enum: ['electronics', 'documents', 'accessories', 'clothing', 'books', 'keys', 'other'],
        default: 'other'
    },
    location: String,
    locationAr: String,
    date: { type: Date, default: Date.now },
    images: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactPhone: String,
    contactEmail: String,
    status: {
        type: String,
        enum: ['active', 'claimed', 'returned', 'expired'],
        default: 'active'
    },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimedAt: Date
}, { timestamps: true });

lostItemSchema.index({ title: 'text', description: 'text' });
lostItemSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('LostItem', lostItemSchema);
