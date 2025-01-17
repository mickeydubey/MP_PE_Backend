import AuthService from '../services/authServices.js';

class AuthController {
    // User sign-up
    static async UserSignup(req, res) {
        try {
            const User = await AuthService.registerUser(req.body);
            res.status(201).json({ message: 'User registered successfully', User });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // User login
    static async UserLogin(req, res) {
        try {
            const { user_id, password } = req.body;
            const { User, token } = await AuthService.login(user_id, password);
            res.status(200).json({ message: 'Login successful', User, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Admin sign-up
    static async adminSignup(req, res) {
        try {
            const admin = await AuthService.registerAdmin(req.body);
            res.status(201).json({ message: 'Admin registered successfully', admin });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Admin login
    static async adminLogin(req, res) {
        try {
            const { admin_id, password } = req.body;
            const { admin, token } = await AuthService.adminLogin(admin_id, password);
            res.status(200).json({ message: 'Login successful', admin, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Get User profile
    static async getUserProfile(req, res) {
        try {
            const UserId = req.User.id;
            const User = await AuthService.getProfile(UserId);
            if (!User) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(User);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update User profile
    static async updateUserProfile(req, res) {
        try {
            const UserId = req.User.id;
            const updatedUser = await AuthService.updateProfile(UserId, req.body);
            res.status(200).json({ message: 'User profile updated successfully', updatedUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete User profile
    static async deleteUserProfile(req, res) {
        try {
            const UserId = req.User.id;
            await AuthService.deleteProfile(UserId);
            res.status(200).json({ message: 'User profile deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get admin profile
    static async getAdminProfile(req, res) {
        try {
            const adminId = req.User.id;
            const admin = await AuthService.getProfile(adminId);
            if (!admin || admin.role !== 'admin') {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.status(200).json(admin);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update admin profile
    static async updateAdminProfile(req, res) {
        try {
            const adminId = req.User.id;
            const updatedAdmin = await AuthService.updateProfile(adminId, req.body);
            res.status(200).json({ message: 'Admin profile updated successfully', updatedAdmin });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete admin profile
    static async deleteAdminProfile(req, res) {
        try {
            const adminId = req.User.id;
            await AuthService.deleteProfile(adminId);
            res.status(200).json({ message: 'Admin profile deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

      // Send OTP for password reset
      static async sendResetOTP(req, res) {
        try {
            const { email } = req.body;
            const User = await AuthService.sendOTP(email);
            res.status(200).json({ message: 'OTP sent to your email', User });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Verify OTP
    static async verifyResetOTP(req, res) {
        try {
            const { email, otp } = req.body;
            const User = await AuthService.verifyOTP(email, otp);
            res.status(200).json({ message: 'OTP verified successfully', User });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Reset password
    static async resetPassword(req, res) {
        try {
            const { email, newPassword } = req.body;
            const User = await AuthService.resetPassword(email, newPassword);
            res.status(200).json({ message: 'Password reset successfully', User });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
    


export default AuthController;