import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import axios from "axios";
import "./auth.css";

const API_BASE = "http://localhost:8080";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errorMessage) setErrorMessage("");
  };

  const extractErrorMessage = (error) => {
    console.log("FULL AXIOS ERROR:", error);
    console.log("RESPONSE STATUS:", error?.response?.status);
    console.log("RESPONSE DATA:", error?.response?.data);

    if (error?.code === "ERR_NETWORK") {
      return "Unable to connect to the server";
    }

    const data = error?.response?.data;

    if (typeof data === "string") {
      const lower = data.toLowerCase();

      if (
        lower.includes("<!doctype html") ||
        lower.includes("<html") ||
        lower.includes("</html>")
      ) {
        return "Server returned an unreadable error page";
      }

      return data;
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.join(", ");
    }

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (data?.username) return data.username;
    if (data?.phoneNumber) return data.phoneNumber;
    if (data?.email) return data.email;
    if (data?.password) return data.password;

    if (error?.response?.status === 400) {
      return "Invalid registration data";
    }

    if (error?.response?.status === 403) {
      return "Access denied";
    }

    if (error?.response?.status === 409) {
      return "Email already exists";
    }

    if (error?.response?.status === 500) {
      return "Internal server error";
    }

    return error?.message || "Registration failed";
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phoneNumber = formData.phoneNumber.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return false;
    }

    if (name.length < 3) {
      setErrorMessage("Name must be at least 3 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // If your backend expects Jordan format:
    const phoneRegex = /^\+9627\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage("Phone number must be like +9627XXXXXXXX");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        username: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      };

      const response = await axios.post(
        `${API_BASE}/api/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      setSuccessMessage(
        data?.username
          ? `Account created successfully for ${data.username} ✅`
          : data?.message || "تم إنشاء الحساب بنجاح ✅"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
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
            اكتشف الأردن بطريقة جديدة وتواصل مع مجتمعك المحلي.
          </p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="auth-header-web">
            <h2>إنشاء حساب جديد</h2>
            <p>ابدأ رحلتك معنا اليوم</p>
          </div>

          <form className="auth-card-web" onSubmit={handleRegister}>
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
              <label>الاسم الكامل</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="أدخل اسمك الكامل"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group-web">
              <label>البريد الإلكتروني</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group-web">
              <label>رقم الهاتف</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+9627XXXXXXXX"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group-web">
              <label>كلمة المرور</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group-web">
              <label>تأكيد كلمة المرور</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="********"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn-web"
              disabled={loading}
            >
              {loading ? "Creating account..." : "إنشاء الحساب"}
            </button>

            <p className="switch-web">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="accent-link">
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
