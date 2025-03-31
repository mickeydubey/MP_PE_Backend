import express from 'express';
import SlotBookingController from '../controllers/slotBookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/api/slotbooking',authMiddleware, SlotBookingController.bookSlot);
router.get('/api/slotbooking/:ownername', SlotBookingController.getBooking);
router.get('/api/slotbooking', SlotBookingController.getAllBookings);
router.get('/api/userslotbooking/', authMiddleware, SlotBookingController.getBookingsForUser);
router.delete('/api/slotbooking/:ownername', SlotBookingController.cancelBooking);

export default router;
