import express from "express";
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarBookedDates
} from "../controllers/carController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCars);
router.get("/:id", getCarById);
router.post("/", protect, adminOnly, createCar);
router.put("/:id", protect, adminOnly, updateCar);
router.delete("/:id", protect, adminOnly, deleteCar);
router.get('/search', getCars); 
router.get('/:id/booked-dates', getCarBookedDates);

export default router;