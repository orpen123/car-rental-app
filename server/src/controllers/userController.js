import User from '../models/User.js';
import bcrypt from 'bcryptjs';



export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;






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

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
