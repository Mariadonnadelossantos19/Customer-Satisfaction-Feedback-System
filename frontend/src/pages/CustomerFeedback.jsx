import React from 'react';
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FiCheckCircle, FiAlertCircle, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Navbar from "../Components/Layout/Navbar";

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

  const [currentStep, setCurrentStep] = useState(1); // 1: Satisfaction, 2: Recommendation, 3: Suggestions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
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

    if (currentQuestion < satisfactionCategories.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCurrentStep(2); // Move to recommendation step
    }
  };

  const handleRecommendationChange = (score) => {
    setFormData(prev => ({
      ...prev,
      recommendationScore: score
    }));
    setCurrentStep(3); // Move to suggestions step
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
        `/library-feedback?customerFeedbackId=${response.data._id}&staffVisitId=${staffVisitId}&customerProfileId=${customerProfileId}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(false);
    }
  };

  const currentCategory = satisfactionCategories[currentQuestion];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Satisfaction Ratings
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{currentCategory.icon}</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {currentCategory.label}
              </h2>
              <p className="text-gray-600 mb-8">
                How would you rate your experience?
              </p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {Object.entries(emojiRatings).map(([value, { emoji, label, color }]) => (
                <button
                  key={value}
                  onClick={() => handleSatisfactionChange(currentCategory.key, value)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 
                    ${color} hover:shadow-md hover:scale-105`}
                >
                  <span className="text-4xl mb-2">{emoji}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2: // Recommendation Score
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🌟</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Would You Recommend Us?
              </h2>
              <p className="text-gray-600 mb-8">
                How likely are you to recommend our services to others?
              </p>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {[...Array(10)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handleRecommendationChange(index + 1)}
                  className={`p-4 rounded-lg transition-all duration-200 
                    ${formData.recommendationScore === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-blue-100'}
                  `}
                >
                  <span className="text-lg font-semibold">{index + 1}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Not Likely</span>
              <span>Very Likely</span>
            </div>
          </div>
        );

      case 3: // Suggestions
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">💭</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Additional Feedback
              </h2>
              <p className="text-gray-600 mb-8">
                Please share any suggestions or comments to help us improve.
              </p>
            </div>

            <textarea
              name="suggestions"
              value={formData.suggestions}
              onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
              className="w-full h-32 p-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Your feedback is valuable to us..."
            />

            <button
              onClick={() => setShowSummary(true)}
              className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-blue-600"
            >
              Review Feedback
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSummary = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Feedback Summary</h2>
      
      {/* Satisfaction Ratings */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Satisfaction Ratings</h3>
        {satisfactionCategories.map(({ key, label, icon }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <span className="font-medium text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {emojiRatings[formData.satisfaction[key]]?.emoji}
              </span>
              <span className="text-sm text-gray-600">
                {emojiRatings[formData.satisfaction[key]]?.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Score */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Recommendation Score</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-500">{formData.recommendationScore}/10</span>
          <span className="text-sm text-gray-600">Likelihood to recommend</span>
        </div>
      </div>

      {/* Suggestions */}
      {formData.suggestions && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Your Suggestions</h3>
          <p className="text-gray-600">{formData.suggestions}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
      >
        Submit Feedback
        <FiChevronRight className="text-xl" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <Navbar />
      <div className="flex justify-center items-start mt-12">
        <div className="max-w-4xl w-full my-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8">
              <h1 className="text-3xl font-bold text-white">Customer Feedback</h1>
              <p className="text-blue-100 mt-2">Your feedback helps us improve our services</p>
            </div>

            <div className="w-full bg-gray-200 h-1">
              <div 
                className="bg-blue-600 h-1 transition-all duration-300"
                style={{ 
                  width: showSummary 
                    ? '100%' 
                    : `${((currentStep - 1) * 33.33 + (currentStep === 1 ? (currentQuestion + 1) * (33.33 / satisfactionCategories.length) : 0))}%` 
                }}
              />
            </div>

            <div className="p-8 pt-10">
              {!showSummary ? renderStepContent() : renderSummary()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedback;