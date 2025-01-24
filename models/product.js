const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  industry: String,
  views: { type: Number, default: 0.0 }, // Changed to float
  likes: { type: Number, default: 0.0 }, // Changed to float
  imageUrl: { type: [String], default: [] }, // Array of strings
  category: String,
  description: String,
  modules: { type: [String], default: [] }, // Array of strings
  Features: { type: [String], default: [] }, // Array of strings
  Technologystacks: { type: [String], default: [] }, // Changed to array
  AdditionalModules: String,
  VersionHistory: String,
  Morelikethis: { type: [String], default: [] }, // Array of strings
  Comments: String
});

module.exports = mongoose.model('Product', productSchema);