
const express = require('express');
const User = require('../models/userModel')
const Verification = require('../models/verificationModel');
const responseFunction = require('../utils/responseFunction');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authTokenHandler = require('../middlewares/checkAuthToken');


const isProduction = process.env.NODE_ENV === 'production';
const mailer = async (recieveremail, code) => {
    try {
        if (!process.env.COMPANY_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
            throw new Error("Email configuration is missing in environment variables");
        }

        let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS
    requireTLS: true,
    auth: {
        user: "shubhamprajapati9537@gmail.com", // Your Gmail address
        pass: "jgxkmkvlncvmsqwk",  // Your App Password
    },
});


        let info = await transporter.sendMail({
            from: `Team EduConnect <${process.env.COMPANY_EMAIL}>`,
            to: recieveremail,
            subject: "OTP for EduConnect",
            text: `Your OTP is ${code}`,
            html: `<b>Your OTP is ${code}</b>`,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error.message || error);
        return false;
    }
};

router.post('/sendotp', async (req, res, next) => {
    const { email } = req.body;

    // Validate email input
    if (!email) {
        return responseFunction(res, 400, "Email is required", null, false);
    }

    try {
        // Generate OTP
        const code = Math.floor(100000 + Math.random() * 900000);

        // Send email with OTP
        const isSent = await mailer(email, code);
        if (!isSent) {
            return responseFunction(res, 500, "Failed to send OTP. Please try again later.", null, false);
        }

        // Remove existing verifications for the email
        await Verification.deleteMany({ email });

        // Save the new OTP in the database
        const newVerification = new Verification({
            email: email,
            code: code,
        });

        await newVerification.save();

        // Respond success
        return responseFunction(res, 200, "OTP sent successfully", null, true);
    } catch (err) {
        console.error("Error processing OTP request:", err.message || err);
        return responseFunction(res, 500, "Internal server error", err, false);
    }
});


router.post('/register', async (req, res) => {
    const { name, email, password, otp, role } = req.body;
    if (!name || !email || !password || !otp || !role) {
        return responseFunction(res, 400, 'All fields are required', null, false);
    }

    if (password.length < 6) {
        return responseFunction(res, 400, 'Password should be at least 6 characters long', null, false);
    }
    try {
        let user = await User.findOne({ email });
        let verificationQueue = await Verification.findOne({ email });

        if (user) {
            return responseFunction(res, 400, 'User already exists', null, false);
        }

        if (!verificationQueue) {
            return responseFunction(res, 400, 'Please send OTP first', null, false);
        }
        const isMatch = await bcrypt.compare(otp, verificationQueue.code);

        if (!isMatch) {
            return responseFunction(res, 400, 'Invalid OTP', null, false);
        }

        user = new User({
            name,
            email,
            password,
            role,
        });

        await user.save();
        await Verification.deleteOne({ email });


        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '10d' });

        res.cookie('authToken', authToken, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: 'none',
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: 'none',
        });

        user.password = undefined;
        return responseFunction(res, 200, 'Registered successfully', { user, authToken, refreshToken }, true);

    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '10d' })


        user.password = undefined;

        // res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'none' })
        // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:true, sameSite: 'none' })
        res.cookie('authToken', authToken, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: 'none',
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: 'none',
        });

        return responseFunction(res, 200, 'Logged in successfully', { user, authToken, refreshToken }, true);

    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})


router.get('/checklogin', authTokenHandler, async (req, res, next) => {
    console.log('check login',req.message)
    
    res.json({
        ok: req.ok,
        message: req.message,
        userId: req.userId
    })
}
)


router.get('/getuser', authTokenHandler, async (req, res, next) => {

    try {
        const user = await User.findById(req.userId).select('-password');


        if (!user) {
            return responseFunction(res, 400, 'User not found', null, false);
        }
        return responseFunction(res, 200, 'User found', user, true);

    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})


router.get('/logout', authTokenHandler, async (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: isProduction, 
        sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction, 
        sameSite: 'none',
    });

    return responseFunction(res, 200, 'Logged out successfully', null, true);
});


module.exports = router;    
