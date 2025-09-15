const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

async function connectDB() {
  try {
    if (isConnected) return;

    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.warn("MongoDB URI missing (set MONGODB_URI or MONGO_URI). Skipping DB connect.");
      return;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

module.exports = connectDB;