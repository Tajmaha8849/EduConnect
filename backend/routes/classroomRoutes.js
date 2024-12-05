const express = require('express');
const Classroom = require('../models/classroomModel');
const responseFunction = require('../utils/responseFunction');
const authTokenHandler = require('../middlewares/checkAuthToken');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const nodemailer = require('nodemailer');
const ClassroomJoin = require('../models/classroomJoinModel');
const router = express.Router();

const mailer = async (receiverEmail, code) => {
    try {
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
            from: "Team EduConnect <no-reply@mastersgang.com>",
            to: receiverEmail,
            subject: "OTP from EduConnect",
            text: `To Join a Classroom Your OTP is ${code}`,
            html: `<b>To Join a Classroom requested by the Student. OTP for the requested classroom is ${code}</b>`,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

// Create a classroom
router.post('/create', authTokenHandler, async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return responseFunction(res, 400, 'Classroom name is required', null, false);
    }

    try {
        const newClassroom = new Classroom({
            name,
            description,
            owner: req.userId,
        });

        await newClassroom.save();
        return responseFunction(res, 201, 'Classroom created successfully', newClassroom, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err.message || err, false);
    }
});

// Fetch classrooms created by the logged-in teacher
router.get('/classroomscreatedbyme', authTokenHandler, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ owner: req.userId });
        return responseFunction(res, 200, 'Classrooms fetched successfully', classrooms, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err.message || err, false);
    }
});

// Fetch classrooms joined by the student
router.get('/classroomsforstudent', authTokenHandler, async (req, res) => {
    try {
        console.log("User ID from token:", req.userId);

        const user = await User.findById(req.userId);
        if (!user) {
            return responseFunction(res, 404, 'User not found', null, false);
        }

        const studentEmail = user.email;
        console.log("Student email:", studentEmail);

        const classrooms = await Classroom.find({ students: studentEmail });
        if (classrooms.length === 0) {
            return responseFunction(res, 404, 'No classrooms found for this student', null, false);
        }

        return responseFunction(res, 200, 'Classrooms fetched successfully', classrooms, true);
    } catch (error) {
        console.error("Error fetching classrooms for student:", error);
        return responseFunction(res, 500, 'Internal server error', null, false);
    }
});


// Fetch a classroom by ID
// Fetch a classroom by ID
router.get('/getclassbyid/:classid', authTokenHandler, async (req, res) => {
    const { classid } = req.params;

    try {
        const classroom = await Classroom.findById(classid).populate('posts');

        if (!classroom) {
            return responseFunction(res, 400, 'Classroom not found', null, false);
        }

        return responseFunction(res, 200, 'Classroom fetched successfully', classroom, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err.message || err, false);
    }
});


// Add a post to a classroom
router.post('/addpost', authTokenHandler, async (req, res) => {
    const { title, description, classId } = req.body;

    try {
        const classroom = await Classroom.findById(classId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        const newPost = new Post({
            title,
            description,
            classId,
            createdBy: req.userId,
        });

        await newPost.save();

        classroom.posts.push(newPost._id);
        await classroom.save();

        return responseFunction(res, 201, 'Post created successfully', newPost, true);
    } catch (error) {
        return responseFunction(res, 500, 'Internal server error', error.message || error, false);
    }
});

// Search for classrooms
router.get('/classrooms/search', async (req, res) => {
    try {
        const term = req.query.term;

        if (!term) {
            return responseFunction(res, 400, 'Search term is required', null, false);
        }

        const results = await Classroom.find({
            name: { $regex: new RegExp(term, 'i') },
        });

        if (results.length === 0) {
            return responseFunction(res, 404, 'No classrooms found', null, false);
        }

        return responseFunction(res, 200, 'Search results', results, true);
    } catch (error) {
        console.error("Error:", error);
        return responseFunction(res, 500, 'Internal server error', null, false);
    }
});

// Request to join a classroom
router.post('/request-to-join', authTokenHandler, async (req, res) => {
    const { classroomId, studentEmail } = req.body;

    if (!classroomId || !studentEmail) {
        return responseFunction(res, 400, 'Classroom ID and student email are required', null, false);
    }

    try {
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        const classOwner = await User.findById(classroom.owner);

        if (!classOwner) {
            return responseFunction(res, 404, 'Class owner not found', null, false);
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        const isSent = await mailer(classOwner.email, code);

        if (!isSent) {
            return responseFunction(res, 500, 'Failed to send OTP', null, false);
        }

        const newClassroomJoin = new ClassroomJoin({
            classroomId,
            studentEmail,
            code,
            classOwnerEmail: classOwner.email,
        });

        await newClassroomJoin.save();
        return responseFunction(res, 200, 'OTP sent to the class owner', null, true);
    } catch (error) {
        console.error(error);
        return responseFunction(res, 500, 'Internal server error', error.message || error, false);
    }
});

// Verify OTP and join classroom
router.post('/verify-otp', authTokenHandler, async (req, res) => {
    const { classroomId, studentEmail, otp } = req.body;

    if (!classroomId || !studentEmail || !otp) {
        return responseFunction(res, 400, 'Classroom ID, student email, and OTP are required', null, false);
    }

    try {
        const joinRequest = await ClassroomJoin.findOne({
            classroomId,
            studentEmail,
            code: otp,
        });

        if (!joinRequest) {
            return responseFunction(res, 400, 'Invalid OTP or join request', null, false);
        }

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        if (!classroom.students.includes(studentEmail)) {
            classroom.students.push(studentEmail);
            await classroom.save();
        }

        await ClassroomJoin.deleteOne({ _id: joinRequest._id });
        return responseFunction(res, 200, 'Successfully joined the class', null, true);
    } catch (error) {
        console.error(error);
        return responseFunction(res, 500, 'Internal server error', error.message || error, false);
    }
});

module.exports = router;
