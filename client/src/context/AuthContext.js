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
      const now = Date.now();

      if (now < expiration) {
        setAuth({ user, loading: false });

        // Automatically log out when the session expires
        setTimeout(() => logout(false), expiration - now);
      } else {
        logout(false); // Session has already expired
      }
    } else {
      setAuth({ user: null, loading: false });
    }
  }, []);

  const login = (userData, sessionDuration = 3600000) => { // Default duration: 1 hour
    const expiration = Date.now() + sessionDuration;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('expiration', expiration.toString());

    setAuth({ user: userData, loading: false });

    // Set timeout for automatic logout
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
        <div>Loading...</div> // You can replace this with a custom spinner/loader
      ) : (
        <>
          {children}
          <ToastContainer /> {/* Enables toast notifications */}
        </>
      )}
    </AuthContext.Provider>
  );
};
