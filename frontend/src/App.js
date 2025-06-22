// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CanvasBoard from './components/canvas/CanvasBoard';
import Login from './components/auth/Login';


import {jwtDecode} from 'jwt-decode';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token); // exp is in seconds since epoch
    if (!exp) return true;
    const now = Date.now() / 1000; // current time in seconds
    return exp < now;
  } catch {
    return true; // If decoding fails, treat as expired
  }
}

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token || isTokenExpired(token)) {
    localStorage.clear(); // clear any old tokens or data
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      // Clean up the URL (remove ?token=...) without reloading the page
      window.history.replaceState({}, document.title, '/');
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <CanvasBoard />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
