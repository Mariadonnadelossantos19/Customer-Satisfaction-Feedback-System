import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ReviewSummary = () => {
  const [searchParams] = useSearchParams();
  const staffVisitId = searchParams.get("staffVisitId");
  const customerFeedbackId = searchParams.get("customerFeedbackId");

  const [summaryData, setSummaryData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/review-summary/${staffVisitId}/${customerFeedbackId}`);
        setSummaryData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [staffVisitId, customerFeedbackId]);

  const handleSubmitReview = async () => {
    const reviewData = {
      staffVisit: summaryData.staffVisit,
      customerProfile: summaryData.customerProfile,
      customerFeedback: summaryData.customerFeedback,
      libraryFeedback: summaryData.libraryFeedback,
    };

    try {
      await axios.post("http://localhost:5000/api/reviews", reviewData);
      navigate('/thank-you'); // Redirect to a thank you page or similar
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Satisfaction Feedback Summary</h1>

      {summaryData && (
        <div className="border p-4 rounded shadow-md">
          <div>
          <h2 className="text-xl font-semibold mt-4">Services Inquired On/Availed</h2>
          <ul>
            {(summaryData.servicesInquired || []).map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
          
          </div>
          <h2 className="text-xl font-semibold">Customer Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Full Name:</strong> {summaryData.customerProfile?.name || 'N/A'}</p>
              <p><strong>Address:</strong> {summaryData.customerProfile?.address || 'N/A'}</p>
              <p><strong>Organization Name:</strong> {summaryData.customerProfile?.organizationName || 'N/A'}</p>
              <p><strong>Contact Information:</strong> {summaryData.customerProfile?.contactInfo || 'N/A'}</p>
              <p><strong>Classification:</strong> {summaryData.customerProfile?.classification || 'N/A'}</p>
            </div>
            <div>
              <p><strong>First Visit:</strong> {summaryData.customerProfile?.firstVisit ? 'Yes' : 'No'}</p>
              <p><strong>Gender:</strong> {summaryData.customerProfile?.sex || 'N/A'}</p>
              <p><strong>Age Group:</strong> {summaryData.customerProfile?.ageGroup || 'N/A'}</p>
              <p><strong>Person with Disability:</strong> {summaryData.customerProfile?.disability ? 'Yes' : 'No'}</p>
              <p><strong>Level of Education:</strong> {summaryData.customerProfile?.educationLevel || 'N/A'}</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-4">Customer Feedback</h2>
          <div>
            <h3>Satisfaction Ratings:</h3>
            <ul>
              {Object.entries(summaryData.customerFeedback.satisfaction).map(([key, value]) => (
                <li key={key}>
                  {key.replace(/([A-Z])/g, " $1").trim()}: {value}
                </li>
              ))}
            </ul>
            <p><strong>RHow likely is it that you would recommend/endorse DOST's services to others?:</strong> {summaryData.customerFeedback.recommendationScore}</p>
            <p><strong>Please help us improve our services with your suggestions and/or comments below. Thank you! 
            :</strong> {summaryData.customerFeedback.suggestions}</p>

          </div>

          <h2 className="text-xl font-semibold mt-4">Library Feedback</h2>
          <p><strong>Queries Answered:</strong> {summaryData.libraryFeedback.queriesAnswered ? "Yes" : "No"}
          </p>
          <p><strong>Main Reason for Visit:</strong> {summaryData.libraryFeedback.mainReason}</p>

          <h2 className="text-xl font-semibold">Staff Visit Details</h2>
          <p><strong>Date of Visit:</strong> {new Date(summaryData.staffVisit.dateOfVisit).toLocaleDateString()}</p>
          <p><strong>Attending Staff:</strong> {summaryData.staffVisit.attendingStaff}</p>

        </div>
      )}

      <button
        onClick={handleSubmitReview}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewSummary;
