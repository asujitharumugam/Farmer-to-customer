const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farm_to_table';

  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB at ${connString}.`);
    console.warn(`[MongoDB Warning]: Server operating with memory fallbacks for testing.`);
  }
};

module.exports = connectDB;
