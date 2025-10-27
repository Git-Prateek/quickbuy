const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();

// In-memory cart for demo (replace with DB for production)
const userCarts = {};

// Get cart
router.get('/', authMiddleware, (req, res) => {
  const cart = userCarts[req.user.userId] || [];
  res.json({ cart });
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (!userCarts[req.user.userId]) userCarts[req.user.userId] = [];
  const cart = userCarts[req.user.userId];
  const itemIndex = cart.findIndex(item => item.productId === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  res.json({ cart });
});

// Remove from cart
router.post('/remove', authMiddleware, (req, res) => {
  const { productId } = req.body;
  const cart = userCarts[req.user.userId] || [];
  userCarts[req.user.userId] = cart.filter(item => item.productId !== productId);
  res.json({ cart: userCarts[req.user.userId] });
});

// Update quantity
router.post('/update', authMiddleware, (req, res) => {
  const { productId, quantity } = req.body;
  const cart = userCarts[req.user.userId] || [];
  const item = cart.find(item => item.productId === productId);
  if (item) item.quantity = quantity;
  res.json({ cart });
});

module.exports = router;
