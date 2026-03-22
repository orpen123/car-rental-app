import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Update profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // const user = await User.findByIdAndUpdate(
    //   req.user._id,
    //   { name, phone },
    //   { new: true, runValidators: true }
    // ).select('-password');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { returnDocument: 'after', runValidators: true },
    ).select('-password');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
