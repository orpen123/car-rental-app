import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    type: {
      type: String,
      enum: ["sedan", "suv", "truck", "convertible", "van", "coupe"],
      required: [true, "Car type is required"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
    },
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      required: [true, "Transmission type is required"],
    },
    fuel: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      required: [true, "Fuel type is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;