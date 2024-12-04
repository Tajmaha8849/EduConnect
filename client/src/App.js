import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer'; // Import Footer component
import Login from './pages/Login';
import Signup from './pages/SignUp';
import HomePage from './pages/HomePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import About from './pages/About';
import { AuthProvider, useAuth } from './context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from './pages/ProfilePage';
import ClassesDetails from './pages/ClassesDetails';

const ProtectedRoute = ({ children }) => {
  const { auth, login } = useAuth();
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/checklogin`, {
          method: 'GET',
          credentials: 'include', 
        });
        const data = await response.json();

        if (response.ok && data.ok) {
          login({ userId: data.userId });
          setLoading(false);
        } else {
          toast.error(data.message || 'Session expired. Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        toast.error('Error checking login status.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth.user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classid"
            element={
              <ProtectedRoute>
                <ClassesDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Privacy Policy */}
          <Route path="/terms" element={<TermsAndConditions />} /> {/* Terms & Conditions */}
          <Route path="/about" element={<About />} />
        </Routes>
        <ToastContainer />
        <Footer /> {/* Add Footer here */}
      </Router>
    </AuthProvider>
  );
};

export default App;
