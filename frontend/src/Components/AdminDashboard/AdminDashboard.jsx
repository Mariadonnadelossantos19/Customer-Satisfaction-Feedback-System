import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Sidebar from '../AdminDashboard/Sidebar';
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement } from 'chart.js';
import { FaUsers, FaDollarSign, FaClipboardList } from 'react-icons/fa';


// Register the required scales and elements
Chart.register(CategoryScale, LinearScale, BarElement, Title, ArcElement);

const AdminDashboard = () => {
  // Sample data for metrics
  const totalCustomers = 1234; // Example metric
  const averageSatisfactionRating = 4.5; // Example metric
  const totalFeedbackReceived = 567; // Example metric

  const feedbackDistribution = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Feedback Distribution',
        data: [70, 20, 10], // Example data
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  const ratingData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Rating Distribution',
        data: [5, 10, 20, 30, 35],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center">
            <FaUsers className="text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Customers</h2>
              <p className="text-xl font-bold">{totalCustomers}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center">
            <FaDollarSign className="text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Avg. Satisfaction Rating</h2>
              <p className="text-xl font-bold">{averageSatisfactionRating}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center">
            <FaClipboardList className="text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Total Feedback Received</h2>
              <p className="text-xl font-bold">{totalFeedbackReceived}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Feedback Distribution</h2>
            <div className="h-64">
              <Bar data={feedbackDistribution} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Rating Distribution</h2>
            <div className="h-64">
              <Pie data={ratingData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;