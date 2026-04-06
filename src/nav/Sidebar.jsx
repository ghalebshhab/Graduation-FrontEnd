import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaPlusSquare, FaCommentDots, FaUser, FaBriefcase, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "me";

  const navItems = [
    { path: '/home', name: 'الرئيسية', icon: <FaHome size={22} /> },
    { path: '/map', name: 'الخريطة', icon: <FaMapMarkedAlt size={22} /> },
    { path: '/create-post', name: 'نشر', icon: <FaPlusSquare size={22} /> },
    { path: '/chat', name: 'الرسائل', icon: <FaCommentDots size={22} /> },
    { path: '/business', name: 'الأعمال', icon: <FaBriefcase size={22} /> },
    { path: `/profile/${userId}`, name: 'حسابي', icon: <FaUser size={22} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-white border-l border-gray-200 sticky top-0 px-4 py-8 shadow-sm">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">JoMap</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                }`
              }
            >
              {item.icon}
              <span className="text-lg">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 mt-auto text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <FaSignOutAlt size={22} />
          <span className="text-lg">تسجيل الخروج</span>
        </button>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION (Hidden on Desktop) --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 px-2 py-3 flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;