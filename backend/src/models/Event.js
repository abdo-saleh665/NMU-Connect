/**
 * Event Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    titleAr: String,
    description: { type: String, required: true },
    descriptionAr: String,
    date: { type: Date, required: true },
    endDate: Date,
    time: String,
    location: { type: String, required: true },
    locationAr: String,
    category: {
        type: String,
        enum: ['academic', 'career', 'workshop', 'sports', 'cultural', 'social', 'other'],
        default: 'other'
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: String,
    capacity: Number,
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    registrationDeadline: Date,
    tags: [String]
}, { timestamps: true });

eventSchema.virtual('attendeeCount').get(function() {
    return this.attendees?.length || 0;
});

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);
