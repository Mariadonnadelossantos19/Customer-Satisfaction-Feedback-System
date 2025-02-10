import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Sidebar from '../AdminDashboard/Sidebar';
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaStar, FaClipboardList } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

const CustomerFeedbackAdmin = () => {
  const [startDate, setStartDate] = useState(new Date().setMonth(new Date().getMonth() - 1));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    averageRating: 0,
    totalFeedback: 0,
    feedbackDistribution: [],
    ratingDistribution: [],
    recentFeedback: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/customer-feedback/all');
        const data = await response.json();
        
        if (response.ok) {
          setDashboardData({
            totalCustomers: data.length,
            averageRating: calculateAverageRating(data),
            totalFeedback: data.length,
            feedbackDistribution: calculateFeedbackDistribution(data),
            ratingDistribution: calculateRatingDistribution(data),
            recentFeedback: data,
          });
        } else {
          console.error('Failed to fetch data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateAverageRating = (data) => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / data.length).toFixed(1);
  };

  const calculateFeedbackDistribution = (data) => {
    let positive = 0, neutral = 0, negative = 0;
    data.forEach(feedback => {
      if (feedback.rating >= 4) positive++;
      else if (feedback.rating === 3) neutral++;
      else negative++;
    });
    return [positive, neutral, negative];
  };

  const calculateRatingDistribution = (data) => {
    let ratings = [0, 0, 0, 0, 0];
    data.forEach(feedback => {
      ratings[feedback.rating - 1]++;
    });
    return ratings;
  };

  const feedbackDistribution = {
    labels: ['Positive (4-5)', 'Neutral (3)', 'Negative (1-2)'],
    datasets: [{
      label: 'Feedback Distribution',
      data: dashboardData.feedbackDistribution,
      backgroundColor: ['#007BFF', '#FFC107', '#DC3545'],
    }]
  };

  const ratingData = {
    labels: ['1 Very Dissatisfied', '2 Dissatisfied', '3 Neutral', '4 Satisfied', '5 Very Satisfied'],
    datasets: [{
      label: 'Rating Distribution',
      data: dashboardData.ratingDistribution,
      backgroundColor: ['#DC3545', '#FF9800', '#FFC107', '#28A745', '#007BFF'],
    }]
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-semibold text-blue-600">Customer Feedback Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Total Customers</h3>
            <p className="text-2xl font-bold">{dashboardData.totalCustomers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Average Rating</h3>
            <p className="text-2xl font-bold">{dashboardData.averageRating}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Total Feedback</h3>
            <p className="text-2xl font-bold">{dashboardData.totalFeedback}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Feedback Distribution</h3>
            <Bar data={feedbackDistribution} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Rating Distribution</h3>
            <Pie data={ratingData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Feedback</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
             
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackAdmin;
