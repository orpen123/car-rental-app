import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import { sendBookingConfirmationEmail } from '../config/email.js';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${booking.car.brand} ${booking.car.model}`,
              description: `${booking.totalDays} day rental — ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}`,
              images: booking.car.images?.[0] ? [booking.car.images[0]] : [],
            },
            unit_amount: Math.round(booking.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/booking-success?bookingId=${bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/${booking.car._id}`,
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payment/webhook
export const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'confirmed', paymentStatus: 'paid' },
        { returnDocument: 'after' }
      ).populate('car');

      // Send confirmation email
      const user = await User.findById(booking.user);
      await sendBookingConfirmationEmail({
        name: user.name,
        email: user.email,
        booking,
        car: booking.car,
      });

      console.log('✅ Booking confirmed:', bookingId);
    } catch (error) {
      console.error('Booking update error:', error);
    }
  }

  res.json({ received: true });
};