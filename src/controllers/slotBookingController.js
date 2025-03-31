import slotBooking from '../models/slotBooking.js';
import SlotBookingService from '../services/slotBookingService.js';

class SlotBookingController {
  async bookSlot(req, res) {
    try {
      const userId = req.user.id; // ✅ From authMiddleware
      const data = { ...req.body, userId };
      const newBooking = await SlotBookingService.bookSlot(data);
      res.status(201).json({ message: 'Slot booked successfully!', newBooking });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getBooking(req, res) {
    try {
      const { ownername } = req.params;
      const booking = await SlotBookingService.getBookingByOwner(ownername);
      if (!booking) return res.status(404).json({ message: 'Booking not found!' });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getBookingsForUser(req, res) {
    try {
      console.log("the req body is",req.body)
      console.log("the req body is",req.user)
      const userId = req.user.id;
      const bookings = await slotBooking.find({ userId });
  
      // if (!bookings || bookings.length === 0) {
      //   return res.status(404).json({ message: "No bookings found for this user." });
      // }
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllBookings(req, res) {
    try {
      const bookings = await SlotBookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async cancelBooking(req, res) {
    try {
      const { ownername } = req.params;
      const deletedBooking = await SlotBookingService.cancelBooking(ownername);
      if (!deletedBooking) return res.status(404).json({ message: 'Booking not found!' });
      res.json({ message: 'Booking canceled successfully!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new SlotBookingController();
