/**
 * Appointment Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        default: 30 // minutes
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    title: String,
    notes: String,
    location: {
        type: String,
        default: 'Office'
    },
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cancelReason: String
}, {
    timestamps: true
});

// Index for querying appointments
appointmentSchema.index({ student: 1, scheduledAt: -1 });
appointmentSchema.index({ faculty: 1, scheduledAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
