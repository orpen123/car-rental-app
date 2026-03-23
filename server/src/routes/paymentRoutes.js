import express from 'express';
import { createCheckoutSession, webhookHandler } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', webhookHandler);

export default router;