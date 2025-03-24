import { createReceiptService, getAllReceiptsService } from '../services/BookingReceipt.js';

// ✅ Create a new receipt and return the data
export const createReceipt = async (req, res) => {
  try {
    const newReceipt = await createReceiptService(req.body);
    res.status(201).json({
      message: '✅ Receipt created successfully',
      receipt: newReceipt,
    });
  } catch (err) {
    console.error('❌ Error creating receipt:', err.message);
    res.status(500).json({ error: 'Failed to create receipt', details: err.message });
  }
};

// 🛠️ Optional — fetch all receipts for admin/reporting
export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await getAllReceiptsService();
    res.status(200).json(receipts);
  } catch (err) {
    console.error('❌ Error fetching all receipts:', err.message);
    res.status(500).json({ error: 'Failed to fetch receipts', details: err.message });
  }
};
