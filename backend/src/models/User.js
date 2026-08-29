// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpHash: {
        type: String,
        default: null,
        select: false // Don't return OTP hash by default
    },
    otpExpiresAt: {
        type: Date,
        default: null,
        select: false // Don't return OTP expiry by default
    },
    githubId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true, // This auto-handles createdAt and updatedAt
    versionKey: false // Remove __v field
});

// Hash password before saving - FIXED with async/await
userSchema.pre('save', async function(next) {
    try {
        // Only hash password if it's modified or new
        if (!this.isModified('password')) {
            return next();
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        
        next();
    } catch (error) {
        console.error('Password hashing error:', error);
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

// Method to return user without sensitive data
userSchema.methods.toSafeObject = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.otpHash;
    delete userObject.otpExpiresAt;
    return userObject;
};

// Method to check if OTP is valid
userSchema.methods.isValidOtp = async function(otp) {
    if (!this.otpHash || !this.otpExpiresAt) {
        return false;
    }
    
    if (new Date() > this.otpExpiresAt) {
        return false;
    }
    
    return await bcrypt.compare(otp, this.otpHash);
};

// Method to clear OTP
userSchema.methods.clearOtp = function() {
    this.otpHash = null;
    this.otpExpiresAt = null;
    return this.save();
};

// Static method to find user by email (including hidden fields)
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email }).select('+otpHash +otpExpiresAt +password');
};

const User = mongoose.model('User', userSchema);

export default User;
