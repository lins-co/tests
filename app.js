const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/products');
require('dotenv').config(); // Load environment variables

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Database Connection
mongoose.connect('mongodb+srv://test:db_test@server.fgqqt.mongodb.net/clinicDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

// Routes
app.use('/api/products', productRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 3023;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
