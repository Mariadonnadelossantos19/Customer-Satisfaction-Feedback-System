import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Sidebar from '../AdminDashboard/Sidebar';
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaStar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [startDate, setStartDate] = useState(new Date().setMonth(new Date().getMonth() - 1));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    averageRating: 0,
    totalFeedback: 0,
    feedbackDistribution: [0, 0, 0], // Positive, Neutral, Negative
    ratingDistribution: [0, 0, 0, 0, 0], // Ratings 1-5
    recentFeedback: [],
  });

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/customer-feedback');
      const data = await response.json();
      
      if (response.ok) {
        setDashboardData({
          totalCustomers: data.length,
          averageRating: calculateAverageRating(data),
          totalFeedback: data.length,
          feedbackDistribution: calculateFeedbackDistribution(data),
          ratingDistribution: calculateRatingDistribution(data),
          recentFeedback: data.slice(0, 5), // Get only the 5 most recent feedbacks
        });
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to calculate average rating
  const calculateAverageRating = (data) => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / data.length).toFixed(1);
  };

  // Function to calculate feedback distribution
  const calculateFeedbackDistribution = (data) => {
    let positive = 0, neutral = 0, negative = 0;
    data.forEach(feedback => {
      if (feedback.rating >= 4) positive++;
      else if (feedback.rating === 3) neutral++;
      else negative++;
    });
    return [positive, neutral, negative];
  };

  // Function to calculate rating distribution (1-5 stars)
  const calculateRatingDistribution = (data) => {
    let ratings = [0, 0, 0, 0, 0];
    data.forEach(feedback => {
      ratings[feedback.rating - 1]++;
    });
    return ratings;
  };

  // Chart Data
  const feedbackDistribution = {
    labels: ['Positive (4-5)', 'Neutral (3)', 'Negative (1-2)'],
    datasets: [{
      label: 'Feedback Distribution',
      data: dashboardData.feedbackDistribution,
      backgroundColor: ['#007BFF', '#FFC107', '#DC3545'],
    }]
  };

  const ratingData = {
    labels: ['1 Very  Satisfied', '2 Satisfied', '3 Neutrals', '4 Dissatisfied', '5 Very  Dissatisfied'],
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
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">Feedback Analytics Dashboard</h1>
        
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {!loading && !error && (
          <>
            {/* Date & Category Filters */}
            <div className="flex gap-4 mb-6">
              <DatePicker selected={startDate} onChange={setStartDate} className="p-2 border rounded-lg" />
              <DatePicker selected={endDate} onChange={setEndDate} className="p-2 border rounded-lg" />
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-4">
                  <FaUsers className="text-blue-600 text-3xl" />
                  <div>
                    <h3 className="text-lg text-gray-500">Total Customers</h3>
                    <p className="text-2xl font-bold text-gray-800">{dashboardData.totalCustomers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Feedback Distribution</h3>
                <Bar data={feedbackDistribution} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Rating Distribution</h3>
                <Pie data={ratingData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
              </div>
            </div>

            {/* Recent Feedback Table */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-blue-600">Recent Feedback</h3>
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
                  <tbody>
                    {dashboardData.recentFeedback.map((feedback, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{feedback.customer}</td>
                        <td className="px-6 py-4">{feedback.rating} <FaStar className="text-yellow-400" /></td>
                        <td className="px-6 py-4">{feedback.comment}</td>
                        <td className="px-6 py-4">{new Date(feedback.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
