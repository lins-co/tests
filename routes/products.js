const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      total,
      totalPages,
      currentPage: page
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product details by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    // Check for existing ID
    const existingProduct = await Product.findOne({ id: req.body.id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product ID must be unique' });
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;