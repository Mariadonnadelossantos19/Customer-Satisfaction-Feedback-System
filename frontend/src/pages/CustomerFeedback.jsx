import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const CustomerFeedback = () => {
  const navigate = useNavigate();
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
    recommendationScore: "",
    suggestions: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const satisfactionCategories = [
    { key: "speedAndTimeliness", label: "Speed and Timeliness" },
    { key: "qualityOfService", label: "Quality of Service" },
    { key: "relevanceOfService", label: "Relevance of Service" },
    { key: "staffCompetence", label: "Staff Competence" },
    { key: "staffAttitude", label: "Staff Attitude" },
    { key: "overallPerception", label: "Overall Perception" },
  ];

  const emojiRatings = {
    1: { emoji: "😡", label: "Very Dissatisfied" },
    2: { emoji: "😟", label: "Dissatisfied" },
    3: { emoji: "😐", label: "Neutral" },
    4: { emoji: "😊", label: "Satisfied" },
    5: { emoji: "😁", label: "Very Satisfied" },
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "recommendationScore" ? Number(value) : value,
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Feedback Form</h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          Feedback submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Satisfaction Ratings</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please rate your satisfaction (1-Very Satisfied to 5-Very
            Dissatisfied)
          </p>

          <div className="space-y-4">
            {satisfactionCategories.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <div className="flex space-x-4">
                  {Object.entries(emojiRatings).map(([value, { emoji, label }]) => (
                    <div className="flex flex-col items-center" key={value}>
                      <button
                        onClick={() => handleSatisfactionChange(key, value)}
                        className={`p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                          formData.satisfaction[key] === Number(value) ? "bg-blue-100" : ""
                        }`}
                        type="button"
                      >
                        {emoji}
                      </button>
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              How likely are you to recommend our services? (0-10)
            </label>
            <input
              type="number"
              name="recommendationScore"
              min="0"
              max="10"
              value={formData.recommendationScore}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Suggestions for Improvement
            </label>
            <textarea
              name="suggestions"
              value={formData.suggestions}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Please share your suggestions..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default CustomerFeedback;
