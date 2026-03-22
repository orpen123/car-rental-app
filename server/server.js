import userRoutes from './src/routes/userRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import carRoutes from './src/routes/carRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Fix CORS — allow all origins for development
app.use(cors({
  origin: '*',
  credentials: false,
}));

// Routes
app.get('/', (req, res) => {
  res.send('Car Rental API is running ✅');
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);


// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

// MongoDB Connection + Start Server
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
  });
});