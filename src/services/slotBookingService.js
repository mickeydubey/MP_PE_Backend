import SlotBooking from '../models/slotBooking.js';

class SlotBookingService {
  async bookSlot(data) {
    const { ownername, contact, slot_no, vehicle_no, date, time } = data;

    // Check if the slot or vehicle number is already taken
    const existingSlot = await SlotBooking.findOne({
      $or: [{ slot_no }, { vehicle_no }, { date, time }],
    });

    if (existingSlot) {
      throw new Error('Slot, vehicle, or time already booked!');
    }

    const newBooking = new SlotBooking({
      ownername,
      contact,
      slot_no,
      vehicle_no,
      date,
      time,
    });

    return await newBooking.save();
  }

  async getBookingByOwner(ownername) {
    return await SlotBooking.findOne({ ownername });
  }

  async getAllBookings() {
    return await SlotBooking.find();
  }

  async cancelBooking(ownername) {
    return await SlotBooking.findOneAndDelete({ ownername });
  }
}

export default new SlotBookingService();
