const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection String
const MONGO_URL = process.env.MONGO_URL 

// Database Name
const DB_NAME = process.env.DB_NAME || "Forum";

// Check for missing required environment variables
if (!MONGO_URL || !DB_NAME) {
  console.error('❌ Missing MONGO_URL or DB_NAME in environment variables.');
  process.exit(1); // Exit the application if the config is invalid
}

// Mongoose connection options
const connectionOptions = {
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin', // Ensures proper authentication
};

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URL, connectionOptions)
  .then(() => {
    console.log('✅ Database Connected Successfully!');
  })
  .catch((err) => {
    console.error('❌ Error connecting to DB:', err);
    process.exit(1); // Exit on connection failure
  });

module.exports = mongoose;
