import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Reviewsummary from "./ReviewSummary";

const CustomerReviewDashboard = () => {
  const [searchParams] = useSearchParams();
  const staffVisitId = searchParams.get("staffVisitId");
  const [customerProfile, setCustomerProfile] = useState(null);
  const [customerFeedback, setCustomerFeedback] = useState(null);
  const [libraryFeedback, setLibraryFeedback] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!staffVisitId) {
        setError("Invalid staff visit ID.");
        setLoading(false);
        return;
      }

      try {
        // Fetch customer profile
        const profileResponse = await axios.get(`http://localhost:5000/api/customer-profiles/visit/${staffVisitId}`);
        setCustomerProfile(profileResponse.data);

        // Fetch customer feedback
        const feedbackResponse = await axios.get(`http://localhost:5000/api/customer-feedback?staffVisitId=${staffVisitId}`);
        setCustomerFeedback(feedbackResponse.data);

        // Fetch library feedback
        const libraryResponse = await axios.get(`http://localhost:5000/api/library-feedback?staffVisitId=${staffVisitId}`);
        setLibraryFeedback(libraryResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staffVisitId]);

  const handleReviewSubmit = (newReview) => {
    console.log("New review submitted:", newReview);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Review Dashboard</h1>

      {/* Customer Profile Section */}
      {customerProfile && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold">Customer Profile</h2>
          <p><strong>Name:</strong> {customerProfile.name}</p>
          <p><strong>Organization:</strong> {customerProfile.organizationName}</p>
          <p><strong>Address:</strong> {customerProfile.address}</p>
          <p><strong>Contact Info:</strong> {customerProfile.contactInfo}</p>
          <p><strong>Classification:</strong> {customerProfile.classification}</p>
          <p><strong>Education Level:</strong> {customerProfile.educationLevel}</p>
        </div>
      )}

      {/* Customer Feedback Section */}
      {customerFeedback && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold">Customer Feedback</h2>
          <h3 className="text-lg font-medium">Satisfaction Ratings:</h3>
          <ul className="list-disc ml-5">
            {Object.entries(customerFeedback.satisfaction).map(([key, value]) => (
              <li key={key}>
                {key.replace(/([A-Z])/g, " $1").trim()}: {value} ⭐
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-medium mt-2">Recommendation Score:</h3>
          <p>{customerFeedback.recommendationScore}/10</p>
          <h3 className="text-lg font-medium mt-2">Suggestions:</h3>
          <p>{customerFeedback.suggestions || "No suggestions provided."}</p>
        </div>
      )}

      {/* Library Feedback Section */}
      {libraryFeedback && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold">Library Feedback</h2>
          <p><strong>Queries Answered:</strong> {libraryFeedback.queriesAnswered ? "Yes" : "No"}</p>
          <h3 className="text-lg font-medium mt-2">Subjects of Interest:</h3>
          <ul className="list-disc ml-5">
            {Object.entries(libraryFeedback.subjectsOfInterest).map(([key, value]) => (
              value && <li key={key}>{key.replace(/([A-Z])/g, " $1").trim()}</li>
            ))}
          </ul>
          <h3 className="text-lg font-medium mt-2">Main Reason for Visit:</h3>
          <p>{libraryFeedback.mainReason}</p>
          {libraryFeedback.mainReason === "others" && (
            <p><strong>Specify:</strong> {libraryFeedback.mainReasonOthersSpecify}</p>
          )}
        </div>
      )}

      {/* Review Form Section */}
      <ReviewForm staffVisitId={staffVisitId} onReviewSubmit={handleReviewSubmit} />
    </div>
  );
};

export default CustomerReviewDashboard;
