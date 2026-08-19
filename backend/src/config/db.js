const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and configure it.');
  }

  mongoose.connection.on('connected', () => {
    console.log('[db] Connected to MongoDB Atlas');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] Connection error:', err.message);
  });

  await mongoose.connect(uri);
}

module.exports = connectDB;
