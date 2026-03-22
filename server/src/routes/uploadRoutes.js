import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', protect, adminOnly, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ message: err.message });
    }
    next();
  });
}, uploadImage);

router.post('/multiple', protect, adminOnly, upload.array('images', 5), uploadMultipleImages);
router.delete('/:public_id', protect, adminOnly, deleteImage);

export default router;