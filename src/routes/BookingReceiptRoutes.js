import express from 'express';
import { createReceipt, getAllReceipts } from '../controllers/BookingReceiptController.js';

const router = express.Router();

// ✅ Route to create a receipt
router.post('/create', createReceipt);

// 🛠️ Optional route — get all receipts (e.g., for admin)
router.get('/', getAllReceipts);

export default router;
