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

// 3. Navigation & Data
import Sidebar from './nav/Sidebar';
import { myProfileData } from './user/data';

// 4. Global Styles
import './index.css';

function App() {
  return (
    <Router>
      <div className="web-app-container">
        <Routes>
          {/* --- AUTHENTICATION ROUTES (No Sidebar) --- */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* --- MAIN APP ROUTES (With Sidebar via a Wrapper) --- */}
          <Route
            path="/*"
            element={
              <div className="main-layout" dir="rtl">
                {/* <Sidebar /> */}
                <div className="content-area">
                  <Routes>
                    <Route path="/" element={<JoMapHome />} />
                    <Route path="/map" element={<JoMapDiscovery />} />
                    <Route path="/location/:id" element={<LocationProfile />} />
                    <Route path="/chat" element={<JoMapChat />} />
                    <Route 
                      path="/profile/:id" 
                      element={<UserProfile />} 
                    />
                    <Route path="/business" element={<BusinessDashboard />} />
                    <Route path="/event/:id" element={<ActivityProfile />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    
                    {/* Fallback to Home */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
