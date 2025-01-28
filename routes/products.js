const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const upload = require('../config/multer'); // Import multer configuration
const cloudinary = require('../config/cloudinary'); // Import Cloudinary configuration
const fs = require('fs'); // For deleting temporary files

// Create new product with multiple image uploads
router.post('/', upload.fields([
  { name: 'images', maxCount: 10 }, // Allow up to 10 images for 'images'
  { name: 'morelikethis', maxCount: 10 }, // Allow up to 10 images for 'morelikethis'
]), async (req, res) => {
  try {
    // Check for existing ID
    const existingProduct = await Product.findOne({ id: req.body.id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product ID must be unique' });
    }

    // Upload images for 'images' field
    let imageUrls = [];
    if (req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url); // Add Cloudinary URL to the array
        fs.unlink(file.path, (err) => { // Delete temporary file
          if (err) console.error('Error deleting temporary file:', err);
        });
      }
    }

    // Upload images for 'morelikethis' field
    let moreLikeThisUrls = [];
    if (req.files.morelikethis) {
      for (const file of req.files.morelikethis) {
        const result = await cloudinary.uploader.upload(file.path);
        moreLikeThisUrls.push(result.secure_url); // Add Cloudinary URL to the array
        fs.unlink(file.path, (err) => { // Delete temporary file
          if (err) console.error('Error deleting temporary file:', err);
        });
      }
    }

    const newProduct = new Product({
      id: req.body.id,
      title: req.body.title,
      industry: req.body.industry,
      views: req.body.views || 0.0,
      likes: req.body.likes || 0.0,
      imageUrl: imageUrls, // Array of image URLs for 'images'
      category: req.body.category,
      description: req.body.description,
      modules: req.body.modules || [],
      Features: req.body.Features || [],
      Technologystacks: req.body.Technologystacks || [],
      AdditionalModules: req.body.AdditionalModules,
      VersionHistory: req.body.VersionHistory,
      Morelikethis: moreLikeThisUrls, // Array of image URLs for 'morelikethis'
      Comments: req.body.Comments,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.status(200).json(products); // Return products as JSON
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }); // Fetch product by ID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // Handle case where product doesn't exist
    }
    res.status(200).json(product); // Return the product details
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

module.exports = router;