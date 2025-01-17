import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = 'your_jwt_secret'; // Use a secure key in a real application
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

class AuthService {
    // Register User
    static async registerUser(data) {
        const user = new User(data);
        await user.save();
        return user;
    }

    // Register admin
    static async registerAdmin(data) {
        const admin = new User({ ...data, role: 'admin' });
        await admin.save();
        return admin;
    }

    // Login logic for Users
    static async login(user_id, password) {
        const user = await User.findOne({ user_id });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, user_id: user.user_id }, JWT_SECRET, { expiresIn: '1h' });

        return { user, token };
    }

    // Login logic for admins
    static async adminLogin(admin_id, password) {
        const admin = await User.findOne({ admin_id });
        if (!admin) {
            throw new Error('Admin not found');
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        // Generate JWT token for admin
        const token = jwt.sign({ id: admin._id, adnin_id: admin.admin_id }, JWT_SECRET, { expiresIn: '1h' });

        return { admin, token };
    }

    // Get profile
    static async getProfile(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // Update profile
    static async updateProfile(userId, data) {
        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    // Delete profile
    static async deleteProfile(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return;
    }

      // Generate and send OTP
      static async sendOTP(email) {
// Generate a 6-digit numeric OTP
const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
  
          
        // Save OTP and its expiry in user record
        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry: Date.now() + OTP_EXPIRY },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        // Configure the email transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Use your email service
            auth: {
                user: 'sujaldubey13@gmail.com', // Your email
                pass: 'djva jqph rncz iulq', // Your email password or app-specific password
            },
        });

        // Send the OTP via email
        await transporter.sendMail({
            from: '"PARKEASE"<sujaldubey13@gmail.com>',
            to: user.email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        });

        return user; // Return user for further operations if needed
    }

    // Verify OTP
    static async verifyOTP(email, otp) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            throw new Error('Invalid or expired OTP');
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return user;
    }

    // Reset password
    static async resetPassword(email, newPassword) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        user.password = newPassword; // This will trigger password hashing in the pre-save hook
        await user.save();

        return user;
    }
}

export default AuthService;