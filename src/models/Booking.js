import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  contactNumber: { type: String, required: true },
  locationName: { type: String, required: true },
  slot: { type: Number, required: true }, // Single index instead of { row, col }
  date: { type: Date, required: true },
  bookedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;