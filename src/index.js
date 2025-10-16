
require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const app = express();

app.use(express.json());

// OTP routes
const otpRoutes = require('./routes/otp');
app.use('/api/otp', otpRoutes);

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

// Import models
require('./models/User');

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    // Sync models
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('PostgreSQL connection error:', err);
  });
