import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import FarmerRegister from './pages/FarmerRegister';
import FarmerLogin from './pages/FarmerLogin';
import OTPVerification from './pages/OTPVerification';
import FarmerDashboard from './pages/FarmerDashboard';
import BookSlot from './pages/BookSlot';
import Queue from './pages/Queue';
import Procurement from './pages/Procurement';
import Payment from './pages/Payment';
import OfficerLogin from './pages/OfficerLogin';
import OfficerDashboard from './pages/OfficerDashboard';

// Protected Route Wrapper for JWT Auth
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('agriqueue_token');
  const role = localStorage.getItem('agriqueue_role');

  if (!token) {
    return <Navigate to={allowedRole === 'officer' ? '/officer/login' : '/farmer/login'} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/farmer/register" element={<FarmerRegister />} />
            <Route path="/farmer/login" element={<FarmerLogin />} />
            <Route path="/farmer/otp-verify" element={<OTPVerification />} />
            <Route path="/officer/login" element={<OfficerLogin />} />

            {/* Protected Farmer Routes */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/book-slot"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <BookSlot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/queue"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <Queue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/procurement"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <Procurement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/payment"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <Payment />
                </ProtectedRoute>
              }
            />

            {/* Protected Officer Routes */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
