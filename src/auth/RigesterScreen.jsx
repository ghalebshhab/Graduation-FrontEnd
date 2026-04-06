import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle, FaPhone } from "react-icons/fa";
import { api } from "../services/api";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  // Trigger load-in animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("كلمات المرور غير متطابقة", "error");
      return;
    }

    setLoading(true);

    try {
      // Backend expects a specific DTO, adjust these keys if your backend differs slightly
      const response = await api.post(`/api/auth/register`, {
        username: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim()
      });

      if (response.status === 200 || response.status === 201) {
        showToast("تم إنشاء الحساب بنجاح! جاري التوجيه...", "success");
        setTimeout(() => navigate("/"), 2000); // Redirect back to login
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "حدث خطأ أثناء التسجيل. حاول مرة أخرى.";
      showToast(errorMsg, "error");
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

      {/* --- Left Side: Registration Form --- */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 bg-white overflow-y-auto">
        <div className={`w-full max-w-md transition-all duration-1000 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">إنشاء حساب جديد ✨</h2>
            <p className="text-gray-500">انضم إلى مجتمع JoMap واكتشف المزيد</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Fields Row */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الأول</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow bg-gray-50 focus:bg-white" />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الأخير</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow bg-gray-50 focus:bg-white" />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} dir="ltr" className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow bg-gray-50 focus:bg-white text-right" placeholder="example@mail.com" />
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaPhone />
                </div>
                <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} dir="ltr" className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow bg-gray-50 focus:bg-white text-right" placeholder="+9627XXXXXXXX" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow bg-gray-50 focus:bg-white" placeholder="••••••••" />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow bg-gray-50 focus:bg-white" placeholder="••••••••" />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className={`w-full flex justify-center mt-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ${loading ? "opacity-75 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-lg"}`}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الإنشاء...</span>
                </div>
              ) : "إنشاء الحساب"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link to="/" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* --- Right Side: Branding (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-blue-700 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className={`transition-all duration-1000 delay-200 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl font-bold mb-6 tracking-tight text-center">
            J<span className="text-indigo-300">o</span>M<span className="text-indigo-300">a</span>p
          </h1>
          <p className="text-xl font-light text-indigo-100 max-w-md text-center leading-relaxed">
            شارك لحظاتك، اكتشف مناطق جديدة، وتواصل مع المجتمع.
          </p>
        </div>
      </div>

    </div>
  );
};

export default RegisterScreen;
