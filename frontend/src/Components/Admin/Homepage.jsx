import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  // FiBell,
  FiPieChart,
  FiUsers,
  //FiDatabase,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { api } from "../../api/axiosConfig";
import FeedbackOverview from "./FeedbackOverview";
import Admin from "./Dashboard";
import PstoAdminManagement from "./PstoAdminManagement";
//import Notifications from './Notifications';
import Reports from "./Reports";
import Settings from "./Settings";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [content, setContent] = useState(<Admin />);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    api.get("/api/auth/admin/me").then((res) => {
      if (res.data.success && res.data.admin) setCurrentAdmin(res.data.admin);
    }).catch(() => setCurrentAdmin(null));
  }, []);

  const handleNavigation = (route) => {
    setActiveItem(route);

    // Handle navigation based on route
    switch (route) {
      case "dashboard":
        setContent(<Admin />);
        break;
      case "feedback-overview":
        setContent(<FeedbackOverview />);
        break;
      case "Reports":
        setContent(<Reports />);
        break;
      case "psto-admins":
        setContent(<PstoAdminManagement />);
        break;
      case "Settings":
        setContent(<Settings />);
        break;
      case "logout":
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        navigate('/admin-login');
        break;

      default:
        setContent(<Admin />);
    }
  };

  const menuItems = [
    { id: "dashboard", icon: FiHome, label: "Dashboard" },
    { id: "feedback-overview", icon: FiClipboard, label: "Feedback Overview" },
    { id: "Reports", icon: FiPieChart, label: "Satisfaction Reports" },
    ...(currentAdmin?.role === "superadmin"
      ? [{ id: "psto-admins", icon: FiUsers, label: "PSTO Admins" }]
      : []),
  ];

  const bottomMenuItems = [
    { id: "Settings", icon: FiSettings, label: "Settings" },
    { id: "logout", icon: FiLogOut, label: "Logout" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-gray-100 w-64 fixed h-full transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-mono tracking-wider flex items-center">
            <span className="text-cyan-400 mr-2">◉</span>
            <span>DOST</span>
            <span className="text-cyan-400 ml-1">MIMAROPA</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            v2.4.1 | Analytics Engine
          </p>
          {currentAdmin && (
            <p className="text-xs text-cyan-300 mt-2 font-mono truncate" title={currentAdmin.username}>
              {currentAdmin.role === "superadmin" ? "Super Admin" : currentAdmin.role === "psto_admin" && currentAdmin.province ? `PSTO: ${currentAdmin.province}` : currentAdmin.username}
            </p>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full p-2 rounded-md transition-all duration-200 ${
                    activeItem === item.id
                      ? "bg-cyan-900/30 text-cyan-400 border-l-2 border-cyan-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-light">{item.label}</span>
                  {item.badge && (
                    <div className="ml-auto bg-cyan-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-700">
          <ul className="space-y-2">
            {bottomMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full p-2 rounded-md transition-all duration-200 ${
                    activeItem === item.id
                      ? "bg-cyan-900/30 text-cyan-400 border-l-2 border-cyan-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-light">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">{content}</div>
    </div>
  );
};

export default Sidebar;
