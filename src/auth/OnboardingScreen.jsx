import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const slides = [
  {
    title: "أهلاً بك في JOMAP",
    text: "اكتشف أجمل المعالم السياحية والأثرية في الأردن بطريقة عصرية.",
    image: "/images/onboarding1.jpg", // Suggested: Use high-quality Jordanian landscape
  },
  {
    title: "خرائط تفاعلية",
    text: "تصفح الخرائط الذكية واحصل على معلومات دقيقة حول كل محافظة ومنطقة.",
    image: "/images/onboarding2.jpg",
  },
  {
    title: "مجتمع متفاعل",
    text: "شارك تجاربك وصورك وقصصك مع مجتمع من المستكشفين.",
    image: "/images/onboarding3.jpg",
  },
];

const Onboarding = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // Effect to handle first-time visit logic
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedJoMap");
    if (hasVisited) {
      navigate("/register"); // Redirect if they've seen it before
    }
  }, [navigate]);

  const finishOnboarding = () => {
    localStorage.setItem("hasVisitedJoMap", "true");
    navigate("/register");
  };

  const next = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      finishOnboarding();
    }
  };

  return (
    <div className="onboarding-web-container" dir="rtl">
      {/* Background Image Layer */}
      <div 
        className="onboarding-bg" 
        style={{ backgroundImage: `url(${slides[index].image})` }}
      >
        <div className="onboarding-overlay" />
      </div>

      {/* Content Layer */}
      <div className="onboarding-content">
        <div className="onboarding-top">
          <h1 className="jomap-logo-onboarding">J<span>o</span>M<span>a</span>p</h1>
          <button className="skip-btn" onClick={finishOnboarding}>تخطي</button>
        </div>

        <div className="onboarding-main-card">
          <div className="onboarding-text-area">
            <h2 className="slide-title">{slides[index].title}</h2>
            <p className="slide-description">{slides[index].text}</p>
          </div>

          <div className="onboarding-controls">
            <div className="dots-web">
              {slides.map((_, i) => (
                <span key={i} className={`dot ${i === index ? "active-dot" : ""}`}></span>
              ))}
            </div>

            <button className="primary-btn-web" onClick={next}>
              {index === slides.length - 1 ? "ابدأ الآن" : "التالي"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
