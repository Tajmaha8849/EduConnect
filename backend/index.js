const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Import database connection
require('./db');

// Allowed origins for CORS (ensure FRONTEND_URL is set in .env file)


// CORS Middleware
app.use(
    cors({
        origin: 'https://edu-connect-sigma.vercel.app', // Frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
        credentials: true, // Allow credentials (cookies)
    })
);

// Middleware for parsing request bodies and cookies
app.use(bodyParser.json());
app.use(
    cookieParser({
        httpOnly: true, // Secure HTTP-only cookies
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'none', // Allow cross-origin cookies
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookies last for 7 days
    })
);

// Import routes
const authRoutes = require('./routes/authRoutes');
const classroomRoutes = require('./routes/classroomRoutes');

// Define routes
app.use('/auth', authRoutes);
app.use('/class', classroomRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Example user data endpoint
app.get('/getuserdata', (req, res) => {
    res.send('Harshal Jain, 45, Male');
});

// Start the server
app.listen(port, () => {
    console.log(`Backend app listening on port ${port}`);
});
