import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../asset/OurLogo.png"; // put your logo here

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/onboarding");
    }, 2500);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="logo-box">
        <img src={logo} alt="JOMAP Logo" />
      </div>

      <h1 className="brand-title">JOMAP</h1>
      <p className="brand-subtitle">استكشف الأردن</p>
    </div>
  );
};

export default SplashScreen;
