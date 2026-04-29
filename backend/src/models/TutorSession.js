/**
 * TutorSession Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: String,
    image: String,
    file: {
        name: String,
        size: String,
        type: String,
        icon: String,
        color: String
    },
    seen: { type: Boolean, default: false }
}, { timestamps: true });

const tutorSessionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    subjectAr: String,
    topic: String,
    topicAr: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    scheduledAt: Date,
    duration: { type: Number, default: 60 },
    messages: [messageSchema],
    rating: { type: Number, min: 1, max: 5 },
    feedback: String
}, { timestamps: true });

tutorSessionSchema.index({ student: 1, status: 1 });
tutorSessionSchema.index({ tutor: 1, status: 1 });

module.exports = mongoose.model('TutorSession', tutorSessionSchema);
