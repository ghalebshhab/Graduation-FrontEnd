import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Auth & Onboarding Screens
import Onboarding from './auth/OnboardingScreen';
import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RigesterScreen';

// 2. Main Application Screens
import JoMapHome from './community/Feed';
import JoMapChat from './chat/Chat';
import JoMapDiscovery from './locations/Discovery_MapComps';
import UserProfile from './user/Profile';
import BusinessDashboard from './buisness/Admins';
import ActivityProfile from './buisness/Event';
import CreatePost from './community/CreatePost';
import LocationProfile from './locations/LocationProfile';

// 3. Navigation
import Sidebar from './nav/Sidebar';

// 4. Global Styles
import './index.css';

// A simple wrapper to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="web-app-container text-gray-800">
        <Routes>
          {/* --- AUTHENTICATION ROUTES --- */}
          {/* Default path '/' now points to Login */}
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* --- MAIN APP ROUTES (Protected) --- */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="main-layout flex h-screen bg-gray-50" dir="rtl">
                  {/* <Sidebar /> */}
                  <div className="content-area flex-1 overflow-y-auto p-4">
                    <Routes>
                      {/* Note: changed root feed to /home to separate from login */}
                      <Route path="/home" element={<JoMapHome />} />
                      <Route path="/map" element={<JoMapDiscovery />} />
                      <Route path="/location/:id" element={<LocationProfile />} />
                      <Route path="/chat" element={<JoMapChat />} />
                      <Route path="/profile/:id" element={<UserProfile />} />
                      <Route path="/business" element={<BusinessDashboard />} />
                      <Route path="/event/:id" element={<ActivityProfile />} />
                      <Route path="/create-post" element={<CreatePost />} />
                      
                      {/* Fallback to Home if authenticated but route not found */}
                      <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;