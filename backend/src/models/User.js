// backend/src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpHash: {
        type: String,
        default: null,
        select: false
    },
    otpExpiresAt: {
        type: Date,
        default: null,
        select: false
    }
}, {
    timestamps: true,
    versionKey: false
});

// Pre-save hook without using 'next'
userSchema.pre('save', async function() {
    // Only hash password if it's modified or new
    if (!this.isModified('password')) {
        return;
    }
    
    try {
        // Hash the password directly
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error('Password hashing error:', error);
        throw error;
    }
});

// Static method to find user by email (including hidden fields)
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email }).select('+otpHash +otpExpiresAt +password');
};

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
