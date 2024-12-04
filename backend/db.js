const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection String
const MONGO_URL = "mongodb+srv://admin:S12hubham@cluster0.bhp3j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database Name
const DB_NAME = "Forum";

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URL, { dbName: DB_NAME }) // dbName is still passed as a parameter
  .then(() => {
    console.log('✅ Database Connected Successfully!');
  })
  .catch((err) => {
    console.error('❌ Error connecting to DB:', err);
    process.exit(1); // Exit on connection failure
  });

module.exports = mongoose;
