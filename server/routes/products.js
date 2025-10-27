const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, sellerOnly } = require('../middleware/auth');

const router = express.Router();

// Get products with pagination and filtering
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;
  const category = req.query.category;
  const sort = req.query.sort;
  const search = req.query.search;

  let query = {};
  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };

  let productsQuery = Product.find(query);
  if (sort === 'price') productsQuery = productsQuery.sort({ price: 1 });
  if (sort === 'title') productsQuery = productsQuery.sort({ title: 1 });
  if (sort === 'rating') productsQuery = productsQuery.sort({ 'reviews.rating': -1 });

  const products = await productsQuery.skip(skip).limit(limit);
  res.json({ products });
});

// Add product (seller only)
router.post('/', authMiddleware, sellerOnly, async (req, res) => {
  const { title, description, price, category, images } = req.body;
  const newProduct = new Product({
    title,
    description,
    price,
    category,
    images,
    seller: req.user.userId
  });
  await newProduct.save();
  res.status(201).json(newProduct);
});

// Update product (seller only)
router.put('/:id', authMiddleware, sellerOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller.toString() !== req.user.userId) return res.status(403).json({ message: 'Not your product' });
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// Delete product (seller only)
router.delete('/:id', authMiddleware, sellerOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller.toString() !== req.user.userId) return res.status(403).json({ message: 'Not your product' });
  await product.remove();
  res.json({ message: 'Product deleted' });
});

module.exports = router;
