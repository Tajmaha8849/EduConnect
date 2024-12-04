import React, { useState } from 'react';
import './SIgnUp.css'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {toast} from 'react-toastify'

const SignUp = () => {
  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false); // For loading state

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit =async (e) => {
        e.preventDefault();
        // handle backend api here
        if (!name || !email || !password || !otp) {
            toast.error('All fields are required');
            return;
        }
        try {
            setLoading(true); // Show loading state
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, otp, role }), // Send all form data
                credentials: 'include', // Include cookies for CORS
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registration successful');
                // Log in the user after successful registration
                login({ email, role });
                navigate('/');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        }
        catch (error) {
            toast.error('Error during registration');
        } finally {
            setLoading(false); // Reset loading state
        }

    }


    const handleSendOtp = async () => {
  if (!email) {
    toast.error('Please enter your email');
    return;
  }

  try {
    setLoading(true); // Show loading state

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/sendotp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }), // Send the email as the body
      credentials: 'include', // Include cookies for CORS
    });

    // Check if the response is okay and handle accordingly
    if (response.ok) {
      const data = await response.json();
      toast.success('OTP sent successfully');
    } else {
      const data = await response.json();
      toast.error(data.message || 'Failed to send OTP');
    }
  } catch (error) {
    // Handle any network or unexpected errors
    console.error("Error sending OTP:", error);
    toast.error('Error sending OTP');
  } finally {
    setLoading(false); // Reset loading state
  }
};


  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email and OTP Button */}
        <div className="email-otp-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="button" onClick={handleSendOtp} className="send-otp-btn">
            Send OTP
          </button>
        </div>

        {/* OTP Input */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role Selection Dropdown */}
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="" disabled>
            Select Role
          </option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
      </form>

      {/* Login Link */}
      <div className="login-link">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
