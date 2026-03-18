import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebook,
  FaUserSecret,
} from "react-icons/fa";
import axios from "axios";
import "./auth.css";

const API_BASE = "http://localhost:8080";

const Login = () => {
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const extractErrorMessage = (error) => {
    console.log("FULL AXIOS ERROR:", error);
    console.log("RESPONSE STATUS:", error?.response?.status);
    console.log("RESPONSE DATA:", error?.response?.data);

    if (error?.code === "ERR_NETWORK") {
      return "Unable to connect to the server (Network Error). Please ensure the Spring Boot backend is running on port 8080 and you are accessing this page via http://localhost:5173 EXACTLY.";
    }

    const data = error?.response?.data;

    if (typeof data === "string") {
      const lower = data.toLowerCase();

      if (
        lower.includes("<!doctype html") ||
        lower.includes("<html") ||
        lower.includes("</html>")
      ) {
        return "الخادم أعاد صفحة خطأ غير مقروءة، تحقق من الـ backend";
      }

      return data;
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.join(", ");
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (error?.response?.status === 401) {
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    }

    if (error?.response?.status === 404) {
      return "البريد الإلكتروني غير موجود";
    }

    if (error?.response?.status === 403) {
      return "ليس لديك صلاحية للوصول";
    }

    if (error?.response?.status === 500) {
      return "حدث خطأ داخلي في الخادم";
    }

    return error?.message || "حدث خطأ في الاتصال بالخادم";
  };

  const validateForm = () => {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      setErrorMessage("يرجى تعبئة جميع الحقول");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("كلمة المرور يجب أن تكون 6 أحرف أو أكثر");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/api/auth/login`,
        {
          email: emailInput.trim().toLowerCase(),
          password: passwordInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (!data?.token) {
        throw new Error("لم يتم استلام التوكن من السيرفر");
      }

      const email = emailInput.trim().toLowerCase();

      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenType", "Bearer");
      localStorage.setItem("authToken", `Bearer ${data.token}`);
      localStorage.setItem("userId", data.userId?.toString() || "");
      localStorage.setItem("userEmail", email);

      try {
        const debugRes = await axios.get(`${API_BASE}/api/auth/debug/user?email=${email}`);
        if (debugRes.data && debugRes.data.exists) {
          localStorage.setItem("username", debugRes.data.name || "");
          localStorage.setItem("role", debugRes.data.role || "");
        }
      } catch (err) {
        console.error("Could not fetch user info", err);
      }

      setSuccessMessage(data.message || "تم تسجيل الدخول بنجاح ✅");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      const msg = extractErrorMessage(error);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-web-container" dir="rtl">
      <div className="auth-hero-section">
        <div className="hero-content">
          <h1 className="jomap-logo-large">
            J<span>o</span>M<span>a</span>p
          </h1>
          <p className="hero-subtitle">
            سجل دخولك لتكتشف أفضل الفعاليات والأماكن في الأردن.
          </p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="auth-header-web">
            <h2>أهلاً بك مجدداً</h2>
            <p>قم بتسجيل الدخول للمتابعة</p>
          </div>

          <form className="auth-card-web" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="message-box error-message-box">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="message-box success-message-box">
                {successMessage}
              </div>
            )}

            <div className="input-group-web">
              <label>البريد الإلكتروني</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="example@mail.com"
                  required
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                />
              </div>
            </div>

            <div className="input-group-web">
              <label>كلمة المرور</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="********"
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                />
              </div>
            </div>

            <p className="forgot-web">نسيت كلمة المرور؟</p>

            <button
              type="submit"
              className="primary-btn-web"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            <div className="divider-web">
              <span>أو سجل عبر</span>
            </div>

            <div className="social-grid-web">
              <button type="button" className="social-btn-web" disabled={loading}>
                <FaGoogle /> Google
              </button>

              <button type="button" className="social-btn-web" disabled={loading}>
                <FaFacebook /> Facebook
              </button>

              <button
                type="button"
                className="social-btn-web guest"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                <FaUserSecret /> زائر
              </button>
            </div>

            <p className="switch-web">
              جديد في JOMAP؟{" "}
              <Link to="/register" className="accent-link">
                إنشاء حساب جديد
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

