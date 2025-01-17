import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
        type: String,
        required: function () {
            return this.role === 'user'; // Required only for users
        }
    },
    user_id: {
        type: String,
        required: function () {
            return this.role === 'user'; // Required only for users
        },
        sparse: true,
        unique: true,
        // No unique constraint here, handled by the index
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // To differentiate users
    admin_id: {
        type: String,
        required: function () {
            return this.role === 'admin'; // Required only for admins
        }
    }, // DTE for admin
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Add a unique index for prnNumber but only for users
userSchema.index({ user_id: 1, role: 1 }, { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { role: 'user' } // Only apply uniqueness for users
});


const user = mongoose.model('User', userSchema);
export default user;