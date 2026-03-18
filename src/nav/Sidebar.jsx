import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  Compass,
  Images,
  SquarePlus,
  User,
  Bell,
  Bookmark,
  Settings,
  LogOut,
  MapPinned,
  Menu,
  X,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Guest";
  const email = localStorage.getItem("userEmail") || "guest@jomap.com";
  const role = localStorage.getItem("role") || "VISITOR";
  const isLoggedIn = !!localStorage.getItem("authToken");

  const initials = useMemo(() => {
    return username?.trim()?.charAt(0)?.toUpperCase() || "G";
  }, [username]);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    closeMobileMenu();
    navigate("/login");
  };

  const mainLinks = [
    { to: "/", label: "Home", icon: House },
    { to: "/community", label: "Community", icon: Compass },
    { to: "/stories", label: "Stories", icon: Images },
    { to: "/create-post", label: "Create Post", icon: SquarePlus },
    { to: "/saved", label: "Saved", icon: Bookmark },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  const secondaryLinks = [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const renderNavLink = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === "/"}
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
        onClick={closeMobileMenu}
      >
        <span className="sidebar-link-icon">
          <Icon size={19} />
        </span>
        <span className="sidebar-link-text">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileMenu}></div>
      )}

      <aside className={`sidebar-shell ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand-block" onClick={() => navigate("/")}>
            <div className="brand-logo">
              <MapPinned size={22} />
            </div>
            <div className="brand-texts">
              <h2>JoMap</h2>
              <span>Discover Jordan</span>
            </div>
          </div>

          <button
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user-card">
          <div className="sidebar-avatar">{initials}</div>

          <div className="sidebar-user-info">
            <h4>{username}</h4>
            <p>{email}</p>
            <span className="sidebar-role-badge">{role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main</div>
          {mainLinks.map(renderNavLink)}

          <div className="sidebar-section-title secondary">Account</div>
          {secondaryLinks.map(renderNavLink)}
        </nav>

        <div className="sidebar-bottom">
          {isLoggedIn ? (
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="sidebar-auth-actions">
              <button
                className="sidebar-login-btn"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/login");
                }}
              >
                Login
              </button>

              <button
                className="sidebar-register-btn"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/register");
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}