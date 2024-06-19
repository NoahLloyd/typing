const mongoose = require("mongoose");

async function connectMongoDB() {
  const uri = process.env.MONGO;

  try {
    const db = mongoose.connection;
    if (db.readyState === 1) {
      console.log("Using existing MongoDB connection");
      return;
    }
    await mongoose.connect(uri, {});
    console.log("Connected to the MongoDB Atlas cluster");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectMongoDB;
