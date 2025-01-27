const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dsuqtt9ye',
  api_key: '634134133419121',
  api_secret: 'o9SMGZpZAoxUVTk24FeDOxoY7Ns',
  secure: true,
});

module.exports = cloudinary;