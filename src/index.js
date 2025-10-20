
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

// Problems routes (MongoDB)
const problemRoutes = require('./routes/problems');
app.use('/api/problems', problemRoutes);
// Testcases router (mounted under /api/problems/:id/testcases)
const testcaseRoutes = require('./routes/testcases');
app.use('/api/problems/:id/testcases', testcaseRoutes);

// Serve uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

// Import models
require('./models/User');
// Connect to MongoDB
const connectMongo = require('./config/mongo');
connectMongo();

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
