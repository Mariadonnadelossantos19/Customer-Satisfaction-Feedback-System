import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaChartPie, FaComments, FaBook, FaUsers, FaCog, FaChartBar } from "react-icons/fa";
//import Navbar from "../../Components/Navbar"; // Navbar Integration

const menuItems = [
  { name: "Dashboard", icon: <FaChartPie />, path: "/admin-dashboard" },
  { name: "Customer Feedback", icon: <FaComments />, path: "/admin-Customer-feedback" },
  { name: "Library Feedback", icon: <FaBook />, path: "/library-feedback" },
  { name: "Analytics & Reports", icon: <FaChartBar />, path: "/" },
  { name: "User Management", icon: <FaUsers />, path: "/" },
  { name: "Settings", icon: <FaCog />, path: "/" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar state

  return (
    <>
      {/* Navbar */}
     

      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-5 left-5 z-50 text-white bg-blue-600 p-3 rounded-full shadow-xl md:hidden transition hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="w-72 bg-gray-900/80 backdrop-blur-lg text-white h-screen p-6 fixed top-0 left-0 shadow-xl flex flex-col z-40 border-r border-gray-700"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Admin Panel</h2>

            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800 hover:bg-blue-500/80 transition duration-300 shadow-md hover:shadow-blue-500/50"
                  >
                    <span className="text-2xl text-blue-300">{item.icon}</span>
                    <span className="text-lg font-medium">{item.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Logout Button */}
            <div className="mt-auto">
              <button className="w-full p-4 mt-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md">
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
