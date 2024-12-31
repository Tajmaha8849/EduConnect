const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Import and initialize the database connection
require('./db');

// CORS Configuration
const allowedOrigins = "https://edu-connect-sigma.vercel.app"; // Add more origins if needed
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman) and explicitly listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Explicitly allowed methods
    credentials: true, // Allow cookies
  })
);

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(
  cookieParser({
    httpOnly: true, // Secure cookie handling
    secure: false, // Change to `true` in production with HTTPS
    sameSite: 'none', // Enable cross-site cookie sharing
    maxAge: 1000 * 60 * 60 * 24 * 7, // Set cookie expiry to 7 days
    signed: true, // Enable signed cookies
  })
);

// Routes
const authRoutes = require('./routes/authRoutes');
const classroomRoutes = require('./routes/classroomRoutes');

app.use('/auth', authRoutes);
app.use('/class', classroomRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Example API for testing
app.get('/getuserdata', (req, res) => {
  res.json({
    name: 'Harshal Jain',
    age: 45,
    gender: 'Male',
  });
});

// Error handling middleware for invalid routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Mastersgang backend app listening on port ${port}`);
});
