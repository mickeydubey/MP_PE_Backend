import express from 'express';
import SlotBookingController from '../controllers/slotBookingController.js';

const router = express.Router();

router.post('/api/slotbooking', SlotBookingController.bookSlot);
router.get('/api/slotbooking/:ownername', SlotBookingController.getBooking);
router.get('/api/slotbooking', SlotBookingController.getAllBookings);
router.delete('/api/slotbooking/:ownername', SlotBookingController.cancelBooking);

export default router;
