import express from 'express';
import AuthController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Import middleware

const router = express.Router();

// User routes
router.post('/signup', AuthController.UserSignup);
router.post('/login', AuthController.UserLogin);
router.get('/profile', authMiddleware, AuthController.getUserProfile);
router.put('/update', authMiddleware, AuthController.updateUserProfile); // Update User profile
router.delete('/delete', authMiddleware, AuthController.deleteUserProfile); // Delete User profile

// Admin routes
router.post('/signupadmin', AuthController.adminSignup);
router.post('/loginadmin', AuthController.adminLogin);
router.get('/profile', authMiddleware, AuthController.getAdminProfile);
router.put('/update', authMiddleware, AuthController.updateAdminProfile); // Update admin profile
router.delete('/admin/delete', authMiddleware, AuthController.deleteAdminProfile); // Delete admin profile

router.post('/send-otp', AuthController.sendResetOTP);
router.post('/verify-otp', AuthController.verifyResetOTP);
router.post('/reset-password', AuthController.resetPassword);

export default router;