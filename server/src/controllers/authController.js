// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import { sendWelcomeEmail } from '../config/email.js';

// // Inside register function — add after user is created:
// await sendWelcomeEmail({ name: user.name, email: user.email });

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// // @desc    Register new user
// // @route   POST /api/auth/register
// export const register = async (req, res, next) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const user = await User.create({ name, email, password, phone });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//   console.error("REGISTER ERROR:", error);
//   res.status(500).json({ message: error.message, stack: error.stack });
// }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get current user
// // @route   GET /api/auth/me
// export const getMe = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// console.log("authController loaded ✅");
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from '../config/email.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, password, phone });

    // ✅ Send welcome email — inside function after user is created
    try {
      await sendWelcomeEmail({ name: user.name, email: user.email });
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};