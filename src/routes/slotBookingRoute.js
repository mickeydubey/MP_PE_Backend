import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Book a slot
router.post('/book', async (req, res) => {
  const { name, vehicleNumber, contactNumber, locationName, slot, date } = req.body;

  try {
    const existingVehicleBooking = await Booking.findOne({
      vehicleNumber,
      locationName,
      date,
    });
    if (existingVehicleBooking) {
      return res.status(400).json({ message: 'This vehicle already has a booking at this location on this date' });
    }

    const existingSlotBooking = await Booking.findOne({ locationName, slot, date });
    if (existingSlotBooking) {
      return res.status(400).json({ message: 'Slot already booked for this date' });
    }

    const booking = new Booking({ name, vehicleNumber, contactNumber, locationName, slot, date });
    await booking.save();

    res.status(201).json({ message: 'Slot booked successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
});

// Get bookings for a location and date
router.get('/bookings', async (req, res) => {
  const { locationName, date } = req.query;
  try {
    const bookings = await Booking.find({ locationName, date });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Get total bookings overview
router.get('/totalbookings', async (req, res) => {
  try {
    const locations = ['Downtown Parking', 'Mall Parking', 'Airport Parking'];
    const bookingsByLocation = await Promise.all(
      locations.map(async (locationName) => {
        const bookings = await Booking.find({ locationName });
        return { locationName, totalBookings: bookings.length };
      })
    );
    res.json(bookingsByLocation);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching total bookings', error: err.message });
  }
});

// Get bookings for a specific location
router.get('/totalbookings/:locationName', async (req, res) => {
  const { locationName } = req.params;
  const { date } = req.query;
  try {
    const bookings = await Booking.find({ locationName, date });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

export default router;