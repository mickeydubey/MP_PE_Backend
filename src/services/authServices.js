import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from "bcrypt";

const JWT_SECRET = 'your_jwt_secret';
const OTP_EXPIRY = 5 * 60 * 1000;

class AuthService {
    static async registerUser(data) {
        const user = new User(data);
        await user.save();
        return user;
    }

    static async registerAdmin(data) {
        console.log("📩 Received Data Before Save:", data);  // Log incoming data
    
        // const hashedPassword = await bcrypt.hash(data.password, 10);
    
        const admin = new User({ 
            username: data.username || null, 
            email: data.email, 
            phone: data.phone || null, 
            admin_id: data.admin_id || "DEFAULT_ADMIN_ID",  // Ensure it's assigned
            password: data.password, 
            role: "admin" 
        });
    
        try {
            const savedAdmin = await admin.save();
            console.log("✅ Saved Admin:", savedAdmin);  // Log after saving
            return savedAdmin;
        } catch (error) {
            console.error("❌ MongoDB Save Error:", error);
            if (error.errors) {
                console.error("Validation Errors:", error.errors);
            }
            throw new Error("Failed to register admin.");
        }
        
    }
    
    

    static async login(username, password) {
        const user = await User.findOne({ username, role: 'user' });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ 
            id: user._id, 
            username: user.username,
            role: user.role 
        }, JWT_SECRET, { expiresIn: '1h' });

        return { User: user, token };
    }

    static async adminLogin(email, password) {
        const admin = await User.findOne({ email, role: 'admin' });
        console.log("admin:",admin);
        
        if (!admin) {
            throw new Error('Admin not found');
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ 
            id: admin._id, 
            email: admin.email,
            role: admin.role 
        }, JWT_SECRET, { expiresIn: '1h' });

        return { admin, token };
    }

    static async getProfile(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    static async updateProfile(userId, data) {
        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    static async deleteProfile(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return;
    }

    static async sendOTP(email) {
        const otp = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        
        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry: Date.now() + OTP_EXPIRY },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'sujaldubey13@gmail.com',
                pass: 'djva jqph rncz iulq',
            },
        });

        await transporter.sendMail({
            from: '"PARKEASE"<sujaldubey13@gmail.com>',
            to: user.email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        });

        return user;
    }

    static async verifyOTP(email, otp) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            throw new Error('Invalid or expired OTP');
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return user;
    }

    static async resetPassword(email, newPassword) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        user.password = newPassword;
        await user.save();

        return user;
    }
}

export default AuthService;