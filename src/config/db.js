const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...',process.env.MONGO_URI); 
    await mongoose.connect("mongodb://localhost:27017",{
      dbName:"Matrimony_testing"
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
} ;

module.exports = connectDB;