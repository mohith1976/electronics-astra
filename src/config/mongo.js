const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

function connectMongo() {
  if (!mongoUri) {
    console.warn('MONGO_URI not set; skipping MongoDB connection');
    return;
  }
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

module.exports = connectMongo;
