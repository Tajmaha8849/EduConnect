const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection String from environment variable
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || "Forum";

// Check if MongoDB URL and DB name are provided
if (!MONGO_URL || !DB_NAME) {
  console.error('❌ Missing MONGO_URL or DB_NAME in environment variables.');
  process.exit(1); // Exit the application if the configuration is invalid
}

// Connection options for MongoDB (Mongoose 6+ no longer needs `useNewUrlParser` or `useUnifiedTopology`)
const connectionOptions = {
  dbName: DB_NAME,
  authSource: 'admin', // Optional: Only if MongoDB requires authentication source
  useFindAndModify: false, // Optional: to prevent deprecated warning
  useCreateIndex: true, // Optional: to avoid deprecation warning
  keepAlive: true, // Keeps the connection alive
  socketTimeoutMS: 30000, // Timeout for socket connections
  reconnectTries: Number.MAX_VALUE, // Reconnect indefinitely
  reconnectInterval: 500, // Interval between reconnection attempts
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

// Enable Mongoose debug mode for logging database queries (Optional)
mongoose.set('debug', true);

module.exports = mongoose;
