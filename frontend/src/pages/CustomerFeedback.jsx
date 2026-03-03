import React from "react";
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
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
    sqd: {
      sqd0: null, sqd1: null, sqd2: null, sqd3: null, sqd4: null,
      sqd5: null, sqd6: null, sqd7: null, sqd8: null,
    },
    recommendationScore: null,
    sqdDisagreeReason: "",
    suggestions: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Satisfaction, 2: SQD, 3: Recommendation, 4: Suggestions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentSqdQuestion, setCurrentSqdQuestion] = useState(0);
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
    1: {
      emoji: "😤",
      label: "Very Dissatisfied",
      emotion: "Frustrated",
      color: "bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300",
      emojiBg: "bg-red-100",
    },
    2: {
      emoji: "😕",
      label: "Dissatisfied",
      emotion: "Disappointed",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300",
      emojiBg: "bg-orange-100",
    },
    3: {
      emoji: "😐",
      label: "Neutral",
      emotion: "Okay",
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300",
      emojiBg: "bg-amber-100",
    },
    4: {
      emoji: "🙂",
      label: "Satisfied",
      emotion: "Pleased",
      color: "bg-brand-50 border-brand-200 hover:bg-brand-100 hover:border-brand-300",
      emojiBg: "bg-brand-100",
    },
    5: {
      emoji: "🤩",
      label: "Very Satisfied",
      emotion: "Delighted",
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
      emojiBg: "bg-emerald-100",
    },
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
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentStep(2); // Move to SQD step
    }
  };

  const SQD_ITEMS = [
    { key: "sqd0", label: "I am satisfied with the service that I availed.", dimension: "Overall" },
    { key: "sqd1", label: "I spent a reasonable amount of time for my transaction.", dimension: "Responsiveness" },
    { key: "sqd2", label: "The office followed the transaction's requirements and steps based on the information provided.", dimension: "Reliability" },
    { key: "sqd3", label: "The steps (including payment) I needed to do for my transaction were easy and simple.", dimension: "Access and Facilities" },
    { key: "sqd4", label: "I easily found information about my transaction from the office or its website.", dimension: "Communication" },
    { key: "sqd5", label: "I paid a reasonable amount of fees for my transaction. (If service was free, mark N/A)", dimension: "Costs" },
    { key: "sqd6", label: 'I feel the office was fair to everyone, or "walang palakasan", during my transaction.', dimension: "Integrity" },
    { key: "sqd7", label: "I was treated courteously by the staff, and (if asked for help) the staff was helpful.", dimension: "Assurance" },
    { key: "sqd8", label: "I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me.", dimension: "Outcome" },
  ];

  const SQD_OPTIONS = [
    { value: 0, label: "Not Applicable", short: "N/A" },
    { value: 1, label: "Strongly Disagree", short: "Strongly Disagree" },
    { value: 2, label: "Disagree", short: "Disagree" },
    { value: 3, label: "Neutral", short: "Neutral" },
    { value: 4, label: "Agree", short: "Agree" },
    { value: 5, label: "Strongly Agree", short: "Strongly Agree" },
  ];

  const sqdEmojiRatings = {
    0: {
      emoji: "➖",
      label: "Not Applicable",
      emotion: "Does not apply",
      color: "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300",
      emojiBg: "bg-slate-200",
    },
    1: {
      emoji: "😤",
      label: "Strongly Disagree", 
      emotion: "Frustrated",
      color: "bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300",
      emojiBg: "bg-red-100",
    },
    2: {
      emoji: "😕",
      label: "Disagree",
      emotion: "Disappointed",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300",
      emojiBg: "bg-orange-100",
    },
    3: {
      emoji: "😐",
      label: "Neutral",
      emotion: "Okay",
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300",
      emojiBg: "bg-amber-100",
    },
    4: {
      emoji: "🙂",
      label: "Agree",
      emotion: "Pleased",
      color: "bg-brand-50 border-brand-200 hover:bg-brand-100 hover:border-brand-300",
      emojiBg: "bg-brand-100",
    },
    5: {
      emoji: "🤩",
      label: "Strongly Agree",
      emotion: "Delighted",
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
      emojiBg: "bg-emerald-100",
    },
  };

  const handleSqdChange = (key, value) => {
    const numVal = value === "" ? null : Number(value);
    setFormData((prev) => ({
      ...prev,
      sqd: { ...prev.sqd, [key]: numVal },
    }));
    if (currentSqdQuestion < SQD_ITEMS.length - 1) {
      setCurrentSqdQuestion((prev) => prev + 1);
    } else {
      setCurrentStep(3);
    }
  };

  const hasSqdDisagree = () => {
    return Object.values(formData.sqd).some((v) => v === 1 || v === 2);
  };

  const handleRecommendationChange = (score) => {
    setFormData((prev) => ({
      ...prev,
      recommendationScore: score,
    }));
    setCurrentStep(4); // Move to suggestions step
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
        `${API_BASE}/api/customer-feedback`,
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

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const currentCategory = satisfactionCategories[currentQuestion];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Satisfaction Ratings
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-2" role="img" aria-hidden>{currentCategory.icon}</div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                {currentCategory.label}
              </h2>
              <p className="text-slate-600 mb-8">
                How would you rate your experience?
              </p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {Object.entries(emojiRatings).map(
                ([value, { emoji, label, emotion, color, emojiBg }]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      handleSatisfactionChange(currentCategory.key, value)
                    }
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 
                      ${color} focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2`}
                  >
                    <span className={`text-5xl mb-2 p-2 rounded-full ${emojiBg}`} role="img" aria-label={label}>
                      {emoji}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {label}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">{emotion}</span>
                  </button>
                )
              )}
            </div>
          </div>
        );

      case 2: // SQD - Service Quality Dimensions (one statement at a time, emoji cards like satisfaction)
        const currentSqdItem = SQD_ITEMS[currentSqdQuestion];
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-2">
                <span className="text-sm font-semibold text-brand-600 uppercase">{currentSqdItem.key.replace("sqd", "SQD")}</span>
                <span className="text-sm text-slate-500">({currentSqdItem.dimension})</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2 px-2">
                {currentSqdItem.label}
              </h2>
              <p className="text-slate-600 mb-6">
                Please rate each statement. Choose &quot;Not Applicable&quot; if the item does not apply to your transaction.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(sqdEmojiRatings).map(([value, { emoji, label, emotion, color, emojiBg }]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSqdChange(currentSqdItem.key, value)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 
                    ${color} focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                    ${formData.sqd[currentSqdItem.key] === Number(value) ? "ring-2 ring-brand-500 ring-offset-2" : ""}`}
                >
                  <span className={`text-4xl md:text-5xl mb-2 p-2 rounded-full ${emojiBg}`} role="img" aria-label={label}>
                    {emoji}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 text-center leading-tight">
                    {label}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 text-center">{emotion}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-1 pt-2">
              {SQD_ITEMS.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-2 h-2 rounded-full ${i === currentSqdQuestion ? "bg-brand-600" : "bg-slate-300"}`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        );

      case 3: // Recommendation Score
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-2" role="img" aria-hidden>🌟</div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                Would You Recommend Us?
              </h2>
              <p className="text-slate-600 mb-8">
                How likely are you to recommend our services to others?
              </p>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {[...Array(10)].map((_, index) => (
                <button
                  key={index + 1}
                  type="button"
                  onClick={() => handleRecommendationChange(index + 1)}
                  className={`p-4 rounded-lg transition-all duration-200 font-semibold
                    ${
                      formData.recommendationScore === index + 1
                        ? "bg-brand-600 text-white shadow-md ring-2 ring-brand-400 ring-offset-2"
                        : "bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 border border-slate-200"
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Not Likely</span>
              <span>Very Likely</span>
            </div>
          </div>
        );

      case 4: // Disagree reason (if any) + Comments/Suggestions
        const showDisagreeReason = hasSqdDisagree();
        const canReview = !showDisagreeReason || (showDisagreeReason && formData.sqdDisagreeReason.trim().length > 0);

        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-2" role="img" aria-hidden>💭</div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                Additional Feedback
              </h2>
              <p className="text-slate-600 mb-6">
                {showDisagreeReason
                  ? "You selected Disagree or Strongly Disagree on one or more items. Please specify your reason below so we can improve."
                  : "Please share any suggestions or comments (optional)."}
              </p>
            </div>

            {showDisagreeReason && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Disagree / Strongly Disagree <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.sqdDisagreeReason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sqdDisagreeReason: e.target.value }))
                  }
                  className="w-full h-28 p-4 rounded-xl border-2 border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-slate-50/50"
                  placeholder="Please specify your reason so we know where we can improve..."
                  required={showDisagreeReason}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Comments / Suggestions (optional)
              </label>
              <textarea
                name="suggestions"
                value={formData.suggestions}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, suggestions: e.target.value }))
                }
                className="w-full h-32 p-4 rounded-xl border-2 border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-slate-50/50"
                placeholder="Your feedback is valuable to us..."
              />
            </div>

            <button
              type="button"
              onClick={() => canReview && setShowSummary(true)}
              disabled={!canReview}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                ${canReview
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
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
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Your Feedback Summary
      </h2>

      {/* Satisfaction Ratings */}
      <div className="space-y-4">
        <h3 className="font-medium text-slate-700">Satisfaction Ratings</h3>
        {satisfactionCategories.map(({ key, label, icon }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <span className="font-medium text-slate-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-hidden>
                {emojiRatings[formData.satisfaction[key]]?.emoji}
              </span>
              <span className="text-sm font-medium text-slate-600">
                {emojiRatings[formData.satisfaction[key]]?.label}
              </span>
              <span className="text-xs text-slate-400">
                {emojiRatings[formData.satisfaction[key]]?.emotion}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SQD */}
      <div className="space-y-3">
        <h3 className="font-medium text-slate-700">Service Quality Dimensions (SQD)</h3>
        {SQD_ITEMS.map(({ key, label, dimension }) => {
          const val = formData.sqd[key];
          const opt = SQD_OPTIONS.find((o) => o.value === val);
          return (
            <div key={key} className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-700">
                {key.replace("sqd", "SQD")} ({dimension}): {opt ? opt.label : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {formData.sqdDisagreeReason && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <h3 className="font-medium text-slate-700 mb-2">Reason for Disagree / Strongly Disagree</h3>
          <p className="text-slate-600 text-sm">{formData.sqdDisagreeReason}</p>
        </div>
      )}

      {/* Recommendation Score */}
      <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
        <h3 className="font-medium text-slate-700 mb-2">Recommendation Score</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-600">
            {formData.recommendationScore}/10
          </span>
          <span className="text-sm text-slate-600">Likelihood to recommend</span>
        </div>
      </div>

      {/* Suggestions */}
      {formData.suggestions && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="font-medium text-slate-700 mb-2">Comments / Suggestions</h3>
          <p className="text-slate-600">{formData.suggestions}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-brand-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        Submit Feedback
        <FiChevronRight className="text-xl" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Navbar />
      <div className="flex justify-center items-start mt-12">
        <div className="max-w-4xl w-full my-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-brand-600 px-8 py-8">
              <h1 className="text-3xl font-bold text-white">
                Customer Feedback
              </h1>
              <p className="text-brand-100 mt-2">
                Your feedback helps us improve our services
              </p>
            </div>

            <div className="w-full bg-slate-200 h-1.5">
              <div
                className="bg-brand-500 h-1.5 transition-all duration-300"
                style={{
                  width: showSummary
                    ? "100%"
                    : currentStep === 1
                      ? `${((currentQuestion + 1) / satisfactionCategories.length) * 25}%`
                      : currentStep === 2
                        ? `${25 + ((currentSqdQuestion + 1) / SQD_ITEMS.length) * 25}%`
                        : currentStep === 3
                          ? "50%"
                          : "75%",
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
