import React, { useState } from 'react';
import { 
  FiHome, 
  FiClipboard, 
  FiBell, 
  FiPieChart, 
  FiDatabase,
  FiSettings, 
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import FeedbackOverview from './FeedbackOverview';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleNavigation = (route) => {
    setActiveItem(route);
    console.log(`Navigating to ${route}`);
    // Add navigation logic here (e.g., using react-router)
  };

  const menuItems = [
    { id: 'dashboard', icon: FiHome, label: 'Dashboard' },
    { id: 'feedback-overview', icon: FiClipboard, label: 'Feedback Overview' },
    { id: 'notifications', icon: FiBell, label: 'Notifications', badge: 10 },
    { id: 'satisfaction-reports', icon: FiPieChart, label: 'Satisfaction Reports' },
    { id: 'customer-insights', icon: FiDatabase, label: 'Customer Insights' },
  ];

  const bottomMenuItems = [
    { id: 'settings', icon: FiSettings, label: 'Settings' },
    { id: 'logout', icon: FiLogOut, label: 'Logout' },
  ];

  return (
    <div>
      {/* Hamburger Menu Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-4 text-white">
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`bg-gray-900 text-gray-100 w-64 h-full fixed transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-mono tracking-wider flex items-center">
            <span className="text-cyan-400 mr-2">◉</span>
            <span>PSTO</span>
            <span className="text-cyan-400 ml-1">Marinduque</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">v2.4.1 | Analytics Engine</p>
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
                      ? 'bg-cyan-900/30 text-cyan-400 border-l-2 border-cyan-400' 
                      : 'hover:bg-gray-800'
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
                      ? 'bg-cyan-900/30 text-cyan-400 border-l-2 border-cyan-400' 
                      : 'hover:bg-gray-800'
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
    </div>
  );
};

export default Sidebar;
