const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/products');
const whatsappMessage = require('./routes/whatsappMessage')

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection
mongoose.connect('mongodb+srv://test:db_test@server.fgqqt.mongodb.net/clinicDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/webhoook', whatsappMessage);

// Start Server
const PORT = process.env.PORT || 3023;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});