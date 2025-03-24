import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },

  vehicleRegNo: { type: String, required: true },
  contactNo: { type: String, required: true },
  date: { type: String, required: true },
  slotAllotted: { type: String, required: true },
  barcode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;
