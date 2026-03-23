import express from 'express';
import {
  createReview,
  getCarReviews,
  deleteReview,
  canReview,
  getAllReviews
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/car/:carId', getCarReviews);
router.get('/can-review/:bookingId', protect, canReview);
router.delete('/:id', protect, adminOnly, deleteReview);
router.get('/', protect, adminOnly, getAllReviews);

export default router;