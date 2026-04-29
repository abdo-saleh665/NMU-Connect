/**
 * User Model - MongoDB Schema
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    nameAr: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
        default: 'student'
    },
    studentId: {
        type: String,
        sparse: true
    },
    department: {
        type: String,
        default: 'Computer Science'
    },
    departmentAr: {
        type: String,
        default: 'علوم الحاسب'
    },
    avatar: {
        type: String,
        default: ''
    },
    phone: String,
    bio: String,
    bioAr: String,
    isActive: {
        type: Boolean,
        default: true
    },
    // For tutors
    isTutor: {
        type: Boolean,
        default: false
    },
    tutorSubjects: [String],
    tutorRating: {
        type: Number,
        default: 0
    },
    tutorSessions: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
