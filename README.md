# 📘 EduConnect – A Collaborative Learning Platform

EduConnexT is a full-stack web platform that enables seamless interaction between **Teachers** and **Students** for virtual classroom management. It supports **role-based access**, **email OTP verification**, **class creation**, **document uploads**, and **student class joining via request/approval system**.

## 🔗 Live Demo
👉 [https://educonnext.vercel.app](https://educonnext.vercel.app) *(Add this if hosted)*

---

## 🧠 Features

### 🔐 Authentication
- Role-based signup/login (Student & Teacher)
- Email verification via **OTP-based verification** before account activation
- Secure password handling with hashing

### 👨‍🏫 Teacher Module
- Create virtual classrooms
- Upload documents/PDFs/notes for each class
- View and manage student join requests
- Accept or reject student requests

### 👨‍🎓 Student Module
- Send class join requests using class code or link
- View accepted class dashboard
- Access uploaded materials (if approved)

### 📬 Notifications
- OTP via email
- Class request status updates

---

## 📁 Project Structure


---

## 🛠️ Tech Stack

### Frontend:
- ReactJS / NextJS
- TailwindCSS / Bootstrap

### Backend:
- NodeJS / Express / NestJS
- MongoDB with Mongoose
- Nodemailer for email OTP
- JWT for secure auth
- Multer for file uploads

### DevOps / Hosting:
- Vercel (Frontend)
- Render / Railway / Heroku (Backend)
- MongoDB Atlas

---

## 🔒 Security
- Password hashing using bcrypt
- OTP expiry mechanism (time-based)
- Authorization middleware for role-based routes
- Validation for file types and uploads

---

## 📷 Screenshots *(Optional - add if available)*

| Login Page | Teacher Dashboard | Join Request |
|------------|-------------------|--------------|
| ![login](screenshots/login.png) | ![teacher](screenshots/teacher_dashboard.png) | ![request](screenshots/join_request.png) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd server
npm install
npm run dev
