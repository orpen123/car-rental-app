// import userRoutes from './src/routes/userRoutes.js';
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env' });
// import express from 'express';
// import cors from 'cors';
// import connectDB from './src/config/db.js';
// import authRoutes from './src/routes/authRoutes.js';
// import carRoutes from './src/routes/carRoutes.js';
// import bookingRoutes from './src/routes/bookingRoutes.js';
// import uploadRoutes from './src/routes/uploadRoutes.js';
// import paymentRoutes from './src/routes/paymentRoutes.js';











// const app = express();

// // existing middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Fix CORS — allow all origins for development
// app.use(cors({
//   origin: '*',
//   credentials: false,
// }));
// // Log to verify env vars are loaded
// console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ loaded' : '❌ missing');
// console.log('PORT:', process.env.PORT);

// // Routes
// app.get('/', (req, res) => {
//   res.send('Car Rental API is running ✅');
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/cars', carRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/users', userRoutes);
// // ⚠️ Webhook needs raw body — add BEFORE express.json()
// app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
// // existing routes
// app.use('/api/payment', paymentRoutes);


// // Global error handler
// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   res.status(status).json({ message: err.message || 'Server Error' });
// });

// // MongoDB Connection + Start Server
// connectDB().then(() => {
//   app.listen(process.env.PORT, () => {
//     console.log(`✅ Server running on port ${process.env.PORT}`);
//   });
// });
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import carRoutes from './src/routes/carRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';

const app = express();

// ✅ MUST be first — before express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// ✅ Then CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: false,
}));

// ✅ Then regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.send('Car Rental API ✅'));
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);


// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
  });
});