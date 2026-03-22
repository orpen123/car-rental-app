import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/", protect, adminOnly, getAllBookings);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, adminOnly, updateBookingStatus);
router.delete("/:id", protect, deleteBooking);
router.put('/:id/cancel', protect, cancelMyBooking);

export default router;