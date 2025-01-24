const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products (without pagination)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
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

    const newProduct = new Product({
      id: req.body.id,
      title: req.body.title,
      industry: req.body.industry,
      views: req.body.views || 0.0,
      likes: req.body.likes || 0.0,
      imageUrl: req.body.imageUrl || [],
      category: req.body.category,
      description: req.body.description,
      modules: req.body.modules || [],
      Features: req.body.Features || [],
      Technologystacks: req.body.Technologystacks || [],
      AdditionalModules: req.body.AdditionalModules,
      VersionHistory: req.body.VersionHistory,
      Morelikethis: req.body.Morelikethis || [],
      Comments: req.body.Comments
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;