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
      navigate('/thank-you');
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="border rounded-lg shadow-md">
        {/* Header */}
        <div className="bg-gray-100 p-4 border-b">
          <h1 className="text-2xl font-bold text-center">CUSTOMER SATISFACTION FEEDBACK FORM</h1>
          <div className="flex justify-between mt-4">
            <div className="flex-1">
              <p className="font-semibold">DEPARTMENT OF SCIENCE AND TECHNOLOGY</p>
              <p>MIMAROPA REGION</p>
            </div>
            <div className="text-right">
              <p>TO F1</p>
              <p>Rev 1/04-25-16</p>
            </div>
          </div>
        </div>

        {summaryData && (
          <div className="p-4">
            {/* Staff Section */}
            <div className="mb-6 border-b pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Date of visit/encounter:</p>
                  <p>{new Date(summaryData.staffVisit.dateOfVisit).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Attending Staff:</p>
                  <p>{summaryData.staffVisit.attendingStaff}</p>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-6 border-b pb-4">
              <h2 className="text-lg font-semibold mb-4">Services Inquired on/availed:</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Technology Transfer & Commercialization (SETUP/GIA)</h3>
                  <ul className="space-y-1">
                    <li>[ ] Food Processing</li>
                    <li>[ ] Gifts, Housewares, Decors</li>
                    <li>[ ] Agri./Horticulture</li>
                    <li>[ ] Aquaculture/Marine</li>
                    <li>[ ] Furniture</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Technical Consultancy</h3>
                  <ul className="space-y-1">
                    <li>[ ] MPEX</li>
                    <li>[ ] CAPE</li>
                    <li>[ ] CPT</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Customer Profile Section */}
            <div className="mb-6 border-b pb-4">
              <h2 className="text-lg font-semibold mb-4">SECTION 1: CUSTOMER'S PROFILE</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Full Name:</strong> {summaryData.customerProfile?.name || 'N/A'}</p>
                  <p><strong>Organization:</strong> {summaryData.customerProfile?.organizationName || 'N/A'}</p>
                  <p><strong>Address:</strong> {summaryData.customerProfile?.address || 'N/A'}</p>
                  <p><strong>Contact:</strong> {summaryData.customerProfile?.contactInfo || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>First Visit:</strong> {summaryData.customerProfile?.firstVisit ? '[ ✓ ] Yes' : '[ ✓ ] No'}</p>
                  <p><strong>Gender:</strong> {summaryData.customerProfile?.sex === 'Male' ? '[ ✓ ] Male' : '[ ✓ ] Female'}</p>
                  <p><strong>Age Group:</strong> {summaryData.customerProfile?.ageGroup}</p>
                  <p><strong>PWD:</strong> {summaryData.customerProfile?.disability ? '[ ✓ ] Yes' : '[ ✓ ] No'}</p>
                </div>
              </div>
            </div>

            {/* Customer Feedback Section */}
            <div className="mb-6 border-b pb-4">
              <h2 className="text-lg font-semibold mb-4">SECTION 2: CUSTOMER EVALUATION/FEEDBACK</h2>
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">Drivers of Satisfaction</th>
                    <th className="p-2">Very Satisfied</th>
                    <th className="p-2">Satisfied</th>
                    <th className="p-2">Neutral</th>
                    <th className="p-2">Dissatisfied</th>
                    <th className="p-2">Very Dissatisfied</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summaryData.customerFeedback.satisfaction).map(([key, value]) => (
                    <tr key={key} className="border-t">
                      <td className="p-2">{key.replace(/([A-Z])/g, " $1").trim()}</td>
                      <td className="p-2 text-center">{value === 5 ? '[✓]' : '[ ]'}</td>
                      <td className="p-2 text-center">{value === 4 ? '[✓]' : '[ ]'}</td>
                      <td className="p-2 text-center">{value === 3 ? '[✓]' : '[ ]'}</td>
                      <td className="p-2 text-center">{value === 2 ? '[✓]' : '[ ]'}</td>
                      <td className="p-2 text-center">{value === 1 ? '[✓]' : '[ ]'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mb-4">
                <p className="font-semibold mb-2">How likely is it that you would recommend/endorse DOST's services to others?</p>
                <div className="flex justify-between">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className={`border p-2 rounded ${summaryData.customerFeedback.recommendationScore === i ? 'bg-blue-500 text-white' : ''}`}>
                        {i}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span>Not at all likely</span>
                  <span>Extremely likely</span>
                </div>
              </div>
            </div>

            {/* Library Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">SECTION 3: FOR LIBRARY USERS ONLY</h2>
              <div className="space-y-4">
                <p><strong>Queries Answered:</strong> {summaryData.libraryFeedback.queriesAnswered ? '[ ✓ ] Yes' : '[ ✓ ] No'}</p>
                <p><strong>Main Reason:</strong> {summaryData.libraryFeedback.mainReason}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmitReview}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSummary;