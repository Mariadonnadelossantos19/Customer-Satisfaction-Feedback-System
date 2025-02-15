import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const FeedbackPreview = () => {
  const [searchParams] = useSearchParams();
  const customerProfileId = searchParams.get("customerProfileId");
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customer-feedback?customerProfileId=${customerProfileId}`);
        setFeedbackData(response.data);
      } catch (err) {
        setError("Error fetching feedback data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (customerProfileId) {
      fetchFeedbackData();
    } else {
      setError("No customer profile ID provided.");
      setLoading(false);
    }
  }, [customerProfileId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Feedback</h1>
      {feedbackData.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
              </tr>
            </thead>
            <tbody>
              {feedbackData.map((feedback) => (
                <tr key={feedback._id} className="border-b">
                  <td className="px-6 py-4">{new Date(feedback.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{feedback.rating} ⭐</td>
                  <td className="px-6 py-4">{feedback.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackPreview; 