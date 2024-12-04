import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
  
      if (!email || !password) {
          toast.error("Email and Password are required!");
          return;
      }
  
      setLoading(true); // Set loading state to true
  
      try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
              credentials: 'include', // Include cookies
          });
  
          const data = await response.json();
  
          if (response.ok) {
              toast.success('Logged in successfully');
              login(data.data); // Set user in context
              navigate('/');
          } else {
              toast.error(data.message || 'Login failed');
          }
      } catch (error) {
          console.error('Login error:', error);
          toast.error('An error occurred during login');
      } finally {
          setLoading(false); // Reset loading state
      }
  };
  

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="signup-link">
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    );
};

export default Login;
