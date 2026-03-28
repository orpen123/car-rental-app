import Review from '../models/Review.js';
import Booking from '../models/Booking.js';



export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed bookings' });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this booking' });
    }

    const review = await Review.create({
      user: req.user._id,
      car: booking.car,
      booking: bookingId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({ reviews, avgRating, total: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const canReview = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) return res.status(404).json({ canReview: false });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(200).json({ canReview: false });
    if (booking.status !== 'completed') return res.status(200).json({ canReview: false });

    const existing = await Review.findOne({ booking: req.params.bookingId });
    res.status(200).json({ canReview: !existing, reviewed: !!existing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('car', 'brand model')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};