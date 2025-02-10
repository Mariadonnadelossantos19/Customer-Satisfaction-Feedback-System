import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-5 fixed top-0 left-0 shadow-lg">
      <h2 className="text-2xl mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li><Link className="hover:text-gray-300" to="/admin-dashboard">Dashboard</Link></li>
        <li><Link className="hover:text-gray-300" to="/customer-feedback">Customer Feedback</Link></li>
        <li><Link className="hover:text-gray-300" to="/library-feedback">Library Feedback</Link></li>
        <li><Link className="hover:text-gray-300" to="/">Analytics & Reports</Link></li>
        <li><Link className="hover:text-gray-300" to="/">User Management</Link></li>
        <li><Link className="hover:text-gray-300" to="/">Settings</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
