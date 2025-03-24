import SlotBookingService from '../services/slotBookingService.js';

class SlotBookingController {
  async bookSlot(req, res) {
    try {
      const newBooking = await SlotBookingService.bookSlot(req.body);
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
