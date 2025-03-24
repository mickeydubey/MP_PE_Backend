import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import slotBookingRoutes from './routes/slotBookingRoutes.js';
import bookingReceiptRoutes from './routes/BookingReceiptRoutes.js';
import accountSettings from './routes/AccountRoutes.js';


dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

connectDB();

// API Routes setup
app.use('/api/users', userRoutes);
app.use('/api/admin',userRoutes);
app.use( slotBookingRoutes);
app.use(bookingReceiptRoutes);
app.use(accountSettings);

// 404 Route Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// Central Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
