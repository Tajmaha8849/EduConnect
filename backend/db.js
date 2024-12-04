const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection String
const MONGO_URL = "mongodb+srv://admin:S12hubham@cluster0.bhp3j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database Name
const DB_NAME = process.env.DB_NAME || "Forum";

// Check for missing required environment variables
if (!MONGO_URL || !DB_NAME) {
  console.error('❌ Missing MONGO_URL or DB_NAME in environment variables.');
  process.exit(1); // Exit the application if the configuration is invalid
}

// Connection options (no longer need `useNewUrlParser` or `useUnifiedTopology` for Mongoose 6+)
const connectionOptions = {
  dbName: DB_NAME,
  authSource: 'admin', // Optional: only if your MongoDB requires authSource
};

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URL, connectionOptions)
  .then(() => {
    console.log('✅ Database Connected Successfully!');
  })
  .catch((err) => {
    console.error('❌ Error connecting to DB:', err.message);
    process.exit(1); // Exit on connection failure
  });

module.exports = mongoose;
