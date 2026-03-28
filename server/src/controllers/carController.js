import Car from "../models/Car.js";
import Booking from '../models/Booking.js';




export const getCarBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      car: req.params.id,
      status: { $nin: ['cancelled'] },
    }).select('startDate endDate');

    const bookedRanges = bookings.map(b => ({
      start: new Date(b.startDate),
      end: new Date(b.endDate),
    }));

    res.status(200).json(bookedRanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const getCars = async (req, res) => {
  try {
    const { search, type, brand, fuel, transmission, available } = req.query;

    const query = {};


    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (fuel) query.fuel = fuel;
    if (transmission) query.transmission = transmission;
    if (available !== undefined) query.available = available === 'true';

    const cars = await Car.find(query);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateCar = async (req, res) => {
  try {




    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
