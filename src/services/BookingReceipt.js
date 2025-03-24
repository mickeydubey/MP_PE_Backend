import Receipt from '../models/Bookingreceipt.js';

// ✅ Create a new receipt (still saves to DB)
export const createReceiptService = async (data) => {
  const newReceipt = new Receipt(data);
  return await newReceipt.save();
};

// 🛠️ Optional: Get all receipts (for admin or reporting)
export const getAllReceiptsService = async () => {
  return await Receipt.find({});
};
