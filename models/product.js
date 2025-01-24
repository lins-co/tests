const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  industry: String,
  views: Number,
  likes: Number,
  imageUrl: [String],
  category: String,
  description: String,
  modules: [String],
  Features: [String],
  Technologystacks: String,
  AdditionalModules: String,
  VersionHistory: String,
  Morelikethis: String,
  Comments: String
});

module.exports = mongoose.model('Product', productSchema);