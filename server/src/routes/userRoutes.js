import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;