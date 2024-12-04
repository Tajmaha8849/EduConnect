import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const expiration = localStorage.getItem('expiration');

    if (user && expiration) {
      const now = new Date().getTime();
      if (now < expiration) {
        setAuth({ user, loading: false });

        // Set a timeout to automatically log out when the session expires
        setTimeout(() => logout(false), expiration - now);
      } else {
        logout(false); // Expired session
      }
    } else {
      setAuth({ user: null, loading: false });
    }
  }, []);

  const login = (userData, sessionDuration = 3600000) => { // Default duration: 1 hour
    const expiration = new Date().getTime() + sessionDuration; // Expiration time in milliseconds
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('expiration', expiration.toString());
    setAuth({ user: userData, loading: false });

    // Set a timeout to automatically log out after the session duration
    setTimeout(() => logout(false), sessionDuration);
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('user');
    localStorage.removeItem('expiration');
    setAuth({ user: null, loading: false });

    if (showToast) {
      toast.success('Logout Successful!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {auth.loading ? (
        <div>Loading...</div> // Replace with a spinner/loader if needed
      ) : (
        <>
          {children}
          <ToastContainer /> {/* Add ToastContainer here */}
        </>
      )}
    </AuthContext.Provider>
  );
};
