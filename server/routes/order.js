const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

// In-memory orders for demo (replace with DB for production)
const orders = [];

// Place order
router.post('/checkout', authMiddleware, async (req, res) => {
  const { cart, address, phone, paymentMethodId } = req.body;
  // Calculate total price (fetch product prices from DB in production)
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  try {
    // Stripe payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true
    });
    // Save order
    orders.push({ userId: req.user.userId, cart, address, phone, total, paymentId: paymentIntent.id });
    res.json({ message: 'Order placed', orderId: paymentIntent.id });
  } catch (err) {
    res.status(400).json({ message: 'Payment failed', error: err.message });
  }
});

// Get user orders
router.get('/', authMiddleware, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.user.userId);
  res.json({ orders: userOrders });
});

module.exports = router;
