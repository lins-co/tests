const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');

// File upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({ message: 'File uploaded successfully', url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

module.exports = router;
