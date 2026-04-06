import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaUserSecret, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { api } from "../services/api"; // Using your configured Axios instance

const LoginScreen = () => {
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isMounted, setIsMounted] = useState(false);

  // Trigger load-in animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const extractErrorMessage = (error) => {
    if (error?.code === "ERR_NETWORK") return "خطأ في الشبكة، تأكد من تشغيل الخادم (Backend).";
    if (error?.response?.status === 401) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    if (error?.response?.status === 404) return "البريد الإلكتروني غير موجود.";
    const data = error?.response?.data;
    if (data?.message) return data.message;
    return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!emailInput || !passwordInput) {
      showToast("يرجى تعبئة جميع الحقول", "error");
      return;
    }

    setLoading(true);

    try {
      // API call using your pre-configured api.js
      const response = await api.post(`/api/auth/login`, {
        email: emailInput.trim().toLowerCase(),
        password: passwordInput,
      });

      const data = response.data;

      if (data?.token) {
        // Save token securely
        localStorage.setItem("authToken", `Bearer ${data.token}`);
        localStorage.setItem("userId", data.id || "");
        localStorage.setItem("username", data.username || "");
        localStorage.setItem("userEmail", data.email || "");
        
        showToast("تم تسجيل الدخول بنجاح! جاري التوجيه...", "success");

        // Redirect after short delay for animation
        setTimeout(() => navigate("/home"), 1500);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* --- Toast Notification System --- */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
      }`}>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg text-white font-medium ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.type === "success" ? <FaCheckCircle size={20} /> : <FaExclamationCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      </div>

      {/* --- Right Side: Branding / Hero (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className={`transition-all duration-1000 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl font-bold mb-6 tracking-tight">
            J<span className="text-blue-300">o</span>M<span className="text-blue-300">a</span>p
          </h1>
          <p className="text-xl font-light text-blue-100 max-w-md text-center leading-relaxed">
            بوابتك لاكتشاف أفضل الأماكن والفعاليات في قلب الأردن. انضم إلينا الآن.
          </p>
        </div>
      </div>

      {/* --- Left Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 bg-white">
        <div className={`w-full max-w-md transition-all duration-1000 delay-200 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">أهلاً بك مجدداً 👋</h2>
            <p className="text-gray-500">قم بتسجيل الدخول للوصول إلى حسابك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow outline-none text-gray-800 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">كلمة المرور</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow outline-none text-gray-800 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-white font-bold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                loading ? "opacity-75 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الدخول...</span>
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">أو أكمل باستخدام</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button disabled={loading} className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                <FaGoogle size={20} />
              </button>
              <button disabled={loading} className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-blue-600">
                <FaFacebook size={20} />
              </button>
              <button 
                onClick={() => navigate("/home")} 
                disabled={loading} 
                className="flex flex-col justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
              >
                <FaUserSecret size={20} />
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            جديد في JOMAP؟{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

