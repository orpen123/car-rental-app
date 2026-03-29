// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import connectDB from './src/config/db.js';
// import authRoutes from './src/routes/authRoutes.js';
// import carRoutes from './src/routes/carRoutes.js';
// import bookingRoutes from './src/routes/bookingRoutes.js';
// import uploadRoutes from './src/routes/uploadRoutes.js';
// import userRoutes from './src/routes/userRoutes.js';
// import paymentRoutes from './src/routes/paymentRoutes.js';
// import reviewRoutes from './src/routes/reviewRoutes.js';
// import contactRoutes from './src/routes/contactRoutes.js';

// const app = express();


// app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));


// // app.use(cors({
// //   origin: process.env.CLIENT_URL,
// //   credentials: false,
// // }));
// app.use(cors({
//   origin: process.env.CLIENT_URL?.split(',') || '*',
//   credentials: true
// }));


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// app.get('/', (req, res) => res.send('Car Rental API ✅'));
// app.use('/api/auth', authRoutes);
// app.use('/api/cars', carRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/contact', contactRoutes);




// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   res.status(status).json({ message: err.message || 'Server Error' });
// });

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
import contactRoutes from './src/routes/contactRoutes.js';

const app = express();

// Webhook must be before cors and json parser
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

const allowedOrigins = [
  'https://car4rental.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('/{*path}', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Car Rental API ✅'));
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
  });
});