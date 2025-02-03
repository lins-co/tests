const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
const cors = require('cors');


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optional: Add image transformation
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Define Mongoose Schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  industry: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  imageUrl: [{ type: String }], // Changed to array of strings
  category: String,
  description: String,
  modules: [String],
  Features: [String],
  Technologystacks: [String],
  AdditionalModules: String,
  VersionHistory: String,
  Morelikethis: [String],
  Comments: String
}, {
  timestamps: true // Add timestamps
});

const Product = mongoose.model('Product', productSchema);

// Express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Connect to MongoDB with proper options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// POST endpoint with multiple image handling
app.post('/api/products', async (req, res) => {
  try {
    // First handle the upload
    const uploadMiddleware = upload.fields([
      { name: 'imageUrl', maxCount: 10 },
      { name: 'Morelikethis', maxCount: 10 }
    ]);

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading files'
        });
      }

      try {
        // Extract image URLs from the uploaded files
        const imageUrls = req.files['imageUrl']?.map(file => file.path) || [];
        const moreLikeThisUrls = req.files['Morelikethis']?.map(file => file.path) || [];

        // Validate required fields
        if (!req.body.id || !req.body.title) {
          return res.status(400).json({
            success: false,
            message: 'ID and title are required'
          });
        }

        // Create product with all data
        const productData = {
          ...req.body,
          imageUrl: imageUrls,
          Morelikethis: moreLikeThisUrls
        };

        const product = new Product(productData);
        await product.save();

        res.status(201).json({
          success: true,
          data: product
        });
      } catch (error) {
        console.error('Error saving product:', error);
        // If there was an error, cleanup uploaded images
        if (req.files) {
          for (const fileArray of Object.values(req.files)) {
            for (const file of fileArray) {
              try {
                const publicId = file.filename;
                await cloudinary.uploader.destroy(publicId);
              } catch (cleanupError) {
                console.error('Error cleaning up uploaded file:', cleanupError);
              }
            }
          }
        }
        res.status(500).json({
          success: false,
          message: 'Error saving product to database',
          error: error.message
        });
      }
    });
  } catch (error) {
    console.error('Outer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: error.message
    });
  }
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

const PORT = process.env.PORT || 3023;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));