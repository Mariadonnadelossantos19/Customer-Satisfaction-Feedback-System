import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const CustomerFeedback = () => {
  const navigate = useNavigate();
  // THIS IS THE PAGE WHERE  THE CUSTOMER GIVE FEEDBACK
  const [searchParams] = useSearchParams();
  const customerProfileId = searchParams.get("customerProfileId");
  const staffVisitId = searchParams.get("staffVisitId");

  const [formData, setFormData] = useState({
    customerProfile: customerProfileId || "",
    staffVisit: staffVisitId || "",
    satisfaction: {
      speedAndTimeliness: "",
      qualityOfService: "",
      relevanceOfService: "",
      staffCompetence: "",
      staffAttitude: "",
      overallPerception: "",
    },
    recommendationScore: null,
    suggestions: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const satisfactionCategories = [
    { key: "speedAndTimeliness", label: "Speed and Timeliness", icon: "⚡" },
    { key: "qualityOfService", label: "Quality of Service", icon: "✨" },
    { key: "relevanceOfService", label: "Relevance of Service", icon: "🎯" },
    { key: "staffCompetence", label: "Staff Competence", icon: "🎓" },
    { key: "staffAttitude", label: "Staff Attitude", icon: "😊" },
    { key: "overallPerception", label: "Overall Perception", icon: "⭐" },
  ];

  const emojiRatings = {
    1: { emoji: "😡", label: "Very Dissatisfied", color: "bg-red-100" },
    2: { emoji: "😟", label: "Dissatisfied", color: "bg-orange-100" },
    3: { emoji: "😐", label: "Neutral", color: "bg-yellow-100" },
    4: { emoji: "😊", label: "Satisfied", color: "bg-blue-100" },
    5: { emoji: "😁", label: "Very Satisfied", color: "bg-green-100" },
  };

  const handleSatisfactionChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      satisfaction: {
        ...prev.satisfaction,
        [category]: Number(value),
      },
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/customer-feedback",
        formData
      );
      setSuccess(true);
      setError("");
      navigate(
        `/library-feedback?customerFeedbackId=${response.data._id}&staffVisitId=${staffVisitId}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Customer Feedback Form
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" role="alert">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded" role="alert">
              <p className="text-green-700">Feedback submitted successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Satisfaction Ratings
              </h2>
              <p className="text-gray-600 mb-6">
                Please rate your satisfaction with our services
              </p>

              <div className="space-y-6">
                {satisfactionCategories.map(({ key, label, icon }) => (
                  <div key={key} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{icon}</span>
                      <label className="text-lg font-medium text-gray-700">
                        {label}
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(emojiRatings).map(([value, { emoji, label, color }]) => (
                        <button
                          type="button"
                          key={value}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSatisfactionChange(key, value);
                          }}
                          className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 
                            ${color} hover:opacity-90 
                            ${formData.satisfaction[key] === Number(value) 
                              ? 'ring-2 ring-blue-500 transform scale-105' 
                              : ''}`}
                        >
                          <span className="text-3xl mb-2">{emoji}</span>
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500">Recommendation Score</h2>
              <p className="text-gray-600 mb-2">How likely is it that you would recommend/endose DOST's services to others?</p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-gray-600">Not at all likely</span>
                {Array.from({ length: 11 }, (_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      handleInputChange({ target: { name: 'recommendationScore', value: index } });
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-200 
                      ${formData.recommendationScore === index ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                  >
                    {index}
                  </button>
                ))}
                <span className="text-gray-600">Extremely likely</span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Suggestions for Improvement
                </label>
                <textarea
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleInputChange}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Please share your suggestions for improvement..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedback;