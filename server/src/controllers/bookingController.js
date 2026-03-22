// import Booking from "../models/Booking.js";
// import Car from "../models/Car.js";

// // @desc    Create booking
// // @route   POST /api/bookings
// // export const createBooking = async (req, res) => {
// //   try {
// //     const { carId, startDate, endDate, pickupLocation, dropoffLocation, notes } = req.body;

// //     // Check if car exists
// //     const car = await Car.findById(carId);
// //     if (!car) {
// //       return res.status(404).json({ message: "Car not found" });
// //     }

// //     // Check if car is available
// //     if (!car.available) {
// //       return res.status(400).json({ message: "Car is not available" });
// //     }

// //     // Calculate total days and price
// //     const start = new Date(startDate);
// //     const end = new Date(endDate);
// //     const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

// //     if (totalDays <= 0) {
// //       return res.status(400).json({ message: "Invalid dates" });
// //     }

// //     const totalPrice = totalDays * car.pricePerDay;

// //     // Create booking
// //     const booking = await Booking.create({
// //       user: req.user._id,
// //       car: carId,
// //       startDate,
// //       endDate,
// //       totalDays,
// //       totalPrice,
// //       pickupLocation,
// //       dropoffLocation,
// //       notes,
// //     });

// //     // Mark car as unavailable
// //     await Car.findByIdAndUpdate(carId, { available: false });

// //     res.status(201).json(booking);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };
// export const createBooking = async (req, res) => {
//   try {
//     const { carId, startDate, endDate, pickupLocation, dropoffLocation, notes } = req.body;

//     const car = await Car.findById(carId);
//     if (!car) return res.status(404).json({ message: 'Car not found' });
//     if (!car.available) return res.status(400).json({ message: 'Car is not available' });

//     // ✅ Check for overlapping bookings
//     const overlapping = await Booking.findOne({
//       car: carId,
//       status: { $nin: ['cancelled'] },
//       $or: [
//         {
//           startDate: { $lte: new Date(endDate) },
//           endDate: { $gte: new Date(startDate) },
//         },
//       ],
//     });

//     if (overlapping) {
//       return res.status(400).json({
//         message: `Car is already booked from ${new Date(overlapping.startDate).toLocaleDateString()} to ${new Date(overlapping.endDate).toLocaleDateString()}`,
//       });
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

//     if (totalDays <= 0) return res.status(400).json({ message: 'Invalid dates' });

//     const totalPrice = totalDays * car.pricePerDay;

//     const booking = await Booking.create({
//       user: req.user._id,
//       car: carId,
//       startDate,
//       endDate,
//       totalDays,
//       totalPrice,
//       pickupLocation,
//       dropoffLocation,
//       notes,
//     });

//     await Car.findByIdAndUpdate(carId, { available: false });

//     res.status(201).json(booking);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all bookings
// // @route   GET /api/bookings
// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user", "name email phone")
//       .populate("car", "brand model year pricePerDay");
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get my bookings
// // @route   GET /api/bookings/my
// export const getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id })
//       .populate("car", "brand model year pricePerDay images");
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get single booking
// // @route   GET /api/bookings/:id
// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate("user", "name email phone")
//       .populate("car", "brand model year pricePerDay");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Update booking status
// // @route   PUT /api/bookings/:id
// export const updateBookingStatus = async (req, res) => {
//   try {
//     const { status, paymentStatus } = req.body;

//     // const booking = await Booking.findByIdAndUpdate(
//     //   req.params.id,
//     //   { status, paymentStatus },
//     //   { new: true, runValidators: true }
//     // );
//     const booking = await Booking.findByIdAndUpdate(
//   req.params.id,
//   { status, paymentStatus },
//   { returnDocument: 'after', runValidators: true }
// );

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // If cancelled → make car available again
//     if (status === "cancelled") {
//       await Car.findByIdAndUpdate(booking.car, { available: true });
//     }

//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete booking
// // @route   DELETE /api/bookings/:id
// export const deleteBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndDelete(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // Make car available again
//     await Car.findByIdAndUpdate(booking.car, { available: true });

//     res.status(200).json({ message: "Booking deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Cancel my booking
// // @route   PUT /api/bookings/:id/cancel
// export const cancelMyBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Make sure it's the user's own booking
//     if (booking.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     if (booking.status === 'cancelled') {
//       return res.status(400).json({ message: 'Booking already cancelled' });
//     }

//     booking.status = 'cancelled';
//     booking.paymentStatus = 'refunded';
//     await booking.save();

//     // Make car available again
//     await Car.findByIdAndUpdate(booking.car, { available: true });

//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { sendBookingConfirmationEmail, sendBookingCancellationEmail } from '../config/email.js';

// @desc    Create booking
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, pickupLocation, dropoffLocation, notes } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (!car.available) return res.status(400).json({ message: 'Car is not available' });

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      car: carId,
      status: { $nin: ['cancelled'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlapping) {
      return res.status(400).json({
        message: `Car is already booked from ${new Date(overlapping.startDate).toLocaleDateString()} to ${new Date(overlapping.endDate).toLocaleDateString()}`,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) return res.status(400).json({ message: 'Invalid dates' });

    const totalPrice = totalDays * car.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      totalDays,
      totalPrice,
      pickupLocation,
      dropoffLocation,
      notes,
    });

    await Car.findByIdAndUpdate(carId, { available: false });

    // ✅ Send booking confirmation email
    try {
      const populatedBooking = await Booking.findById(booking._id).populate('car');
      await sendBookingConfirmationEmail({
        name: req.user.name,
        email: req.user.email,
        booking: populatedBooking,
        car: populatedBooking.car,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('car', 'brand model year pricePerDay images');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car', 'brand model year pricePerDay images');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('car', 'brand model year pricePerDay');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { returnDocument: 'after', runValidators: true },
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If cancelled → make car available again
    if (status === 'cancelled') {
      await Car.findByIdAndUpdate(booking.car, { available: true });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Car.findByIdAndUpdate(booking.car, { available: true });

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel my booking
// @route   PUT /api/bookings/:id/cancel
export const cancelMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    await Car.findByIdAndUpdate(booking.car, { available: true });

    // ✅ Send cancellation email
    try {
      const user = await User.findById(req.user._id);
      const populatedBooking = await Booking.findById(booking._id).populate('car');
      await sendBookingCancellationEmail({
        name: user.name,
        email: user.email,
        booking: populatedBooking,
        car: populatedBooking.car,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the cancellation if email fails
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};