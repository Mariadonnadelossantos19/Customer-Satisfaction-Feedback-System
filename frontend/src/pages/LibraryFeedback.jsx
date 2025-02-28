import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiEdit2, FiBook, FiCoffee, FiTool, FiPackage, FiGift, FiHeart, FiMonitor, FiTruck, FiBookOpen, FiX, FiCheck } from "react-icons/fi";
// Import the modal component
import CongratulationsModal from "./CongratulationsModal";

const LibraryFeedback = () => {
  const [searchParams] = useSearchParams();
  const customerFeedbackId = searchParams.get("customerFeedbackId");
  const staffVisitId = searchParams.get("staffVisitId");
  const navigate = useNavigate();

  const [showSummary, setShowSummary] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLibraryUser, setIsLibraryUser] = useState(null);
  const [formData, setFormData] = useState({
    customerFeedback: customerFeedbackId || "",
    staffVisit: staffVisitId || "",
    queriesAnswered: false,
    subjectsOfInterest: {
      agriHorticulture: false,
      aquacultureMarine: false,
      furniture: false,
      foodProcessing: false,
      giftsHousewaresDecors: false,
      healthAndPharma: false,
      ict: false,
      metalsAndEngineering: false,
      others: false,
      othersSpecify: "",
    },
    mainReason: "",
    mainReasonOthersSpecify: "",
  });

  const subjectCards = [
    { key: 'agriHorticulture', icon: <FiBook />, label: 'Agriculture & Horticulture' },
    { key: 'aquacultureMarine', icon: <FiCoffee />, label: 'Aquaculture & Marine' },
    { key: 'furniture', icon: <FiTool />, label: 'Furniture' },
    { key: 'foodProcessing', icon: <FiPackage />, label: 'Food Processing' },
    { key: 'giftsHousewaresDecors', icon: <FiGift />, label: 'Gifts & Housewares' },
    { key: 'healthAndPharma', icon: <FiHeart />, label: 'Health & Pharma' },
    { key: 'ict', icon: <FiMonitor />, label: 'ICT' },
    { key: 'metalsAndEngineering', icon: <FiTruck />, label: 'Metals & Engineering' },
  ];

  const mainReasons = [
    { value: 'support_course', label: 'Support Course' },
    { value: 'independent_learning', label: 'Independent Learning' },
    { value: 'leisure', label: 'Leisure' },
    { value: 'others', label: 'Others' },
  ];

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Toggle summary view before actual submission
    if (!showSummary) {
      setShowSummary(true);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/library-feedback", formData);
      setSuccess(true);
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleSkip = () => {
    setShowModal(true);
  };

  const handleStart = () => {
    setIsLibraryUser(true);
  };

  const renderForm = () => (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Subjects of Interest */}
      <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-base font-semibold text-gray-700 mb-3">
          Subjects of Interest
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {subjectCards.map(({ key, icon, label }) => (
            <div
              key={key}
              onClick={() => handleInputChange({
                target: {
                  name: `subjectsOfInterest.${key}`,
                  type: 'checkbox',
                  checked: !formData.subjectsOfInterest[key]
                }
              })}
              className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 
                ${formData.subjectsOfInterest[key]
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
              `}
            >
              <div className="flex flex-col items-center justify-center text-center h-16">
                <span className="text-lg text-blue-600 mb-1">{icon}</span>
                <span className="text-xs font-medium text-gray-700 line-clamp-2">{label}</span>
              </div>
            </div>
          ))}
          
          {/* Others Option */}
          <div
            onClick={() => handleInputChange({
              target: {
                name: 'subjectsOfInterest.others',
                type: 'checkbox',
                checked: !formData.subjectsOfInterest.others
              }
            })}
            className={`p-2 rounded-lg border cursor-pointer transition-all duration-200
              ${formData.subjectsOfInterest.others
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
            `}
          >
            <div className="flex flex-col items-center justify-center text-center h-16">
              <span className="text-lg text-blue-600 mb-1">+</span>
              <span className="text-xs font-medium text-gray-700">Others</span>
            </div>
          </div>
        </div>

        {/* Others Specify Input - Animated */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out
          ${formData.subjectsOfInterest.others ? 'max-h-12 mt-2' : 'max-h-0'}
        `}>
          <input
            type="text"
            name="subjectsOfInterest.othersSpecify"
            value={formData.subjectsOfInterest.othersSpecify}
            onChange={handleInputChange}
            placeholder="Please specify other subjects"
            className="w-full p-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Queries Answered */}
      <div className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="queriesAnswered"
            checked={formData.queriesAnswered}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 transition-colors"
          />
          <span className="text-sm font-medium text-gray-700">
            Were your queries answered?
          </span>
        </label>
      </div>

      {/* Main Reason */}
      <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-base font-semibold text-gray-700 mb-2">
          Main Reason for Visit
        </h3>
        <select
          name="mainReason"
          value={formData.mainReason}
          onChange={handleInputChange}
          className="w-full p-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          required
        >
          <option value="">Select Reason</option>
          {mainReasons.map(reason => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>

        {/* Others Specify Input - Animated */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out
          ${formData.mainReason === 'others' ? 'max-h-12 mt-2' : 'max-h-0'}
        `}>
          <input
            type="text"
            name="mainReasonOthersSpecify"
            value={formData.mainReasonOthersSpecify}
            onChange={handleInputChange}
            placeholder="Please specify other reason"
            className="w-full p-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={() => setShowSummary(true)}
        className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl
          hover:from-blue-700 hover:to-blue-800 transition-all duration-200 
          flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm font-medium"
      >
        Review Your Responses
        <FiCheckCircle className="w-4 h-4" />
      </button>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg mt-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Review Your Feedback</h2>
        <button
          onClick={() => setShowSummary(false)}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <FiEdit2 className="w-4 h-4" />
          Edit All Responses
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Queries Answered Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Queries Answered</h3>
              <p className="text-sm text-gray-500">Were your queries addressed?</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${formData.queriesAnswered 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'}
              `}>
                {formData.queriesAnswered ? 'Yes' : 'No'}
              </span>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-400 hover:text-blue-600"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subjects of Interest Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Subjects of Interest</h3>
              <p className="text-sm text-gray-500">Selected areas of study</p>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="text-gray-400 hover:text-blue-600"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(formData.subjectsOfInterest)
              .filter(([key, value]) => value && key !== 'othersSpecify')
              .map(([key]) => {
                const subject = subjectCards.find(card => card.key === key) || { icon: '+', label: 'Others' };
                return (
                  <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                    <span className="text-lg">{React.isValidElement(subject.icon) ? subject.icon : subject.icon}</span>
                    <span className="text-sm font-medium">{subject.label}</span>
                  </div>
                );
              })}
            {formData.subjectsOfInterest.others && formData.subjectsOfInterest.othersSpecify && (
              <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                <span className="text-sm font-medium">
                  Other: {formData.subjectsOfInterest.othersSpecify}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Reason Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Main Reason for Visit</h3>
              <p className="text-sm text-gray-500">Primary purpose of your visit</p>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="text-gray-400 hover:text-blue-600"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2">
            <div className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full">
              <span className="text-sm font-medium">
                {mainReasons.find(r => r.value === formData.mainReason)?.label}
                {formData.mainReason === 'others' && `: ${formData.mainReasonOthersSpecify}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => setShowSummary(false)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Edit Responses
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg 
            hover:from-blue-700 hover:to-blue-800 transition-all duration-200 
            flex items-center justify-center gap-2"
        >
          Submit Feedback
          <FiCheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
              <div className="w-full h-full bg-white/10 rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Library User Feedback</h1>
            <p className="text-blue-100 text-lg">Help us improve our services</p>
          </div>
        </div>

        {isLibraryUser === null ? (
          // Initial choice screen
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Did you use our library services today?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setIsLibraryUser(true)}
                  className="group p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white"
                >
                  Yes, I did
                </button>
                <button
                  onClick={handleSkip}
                  className="group p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700"
                >
                  No, skip feedback
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Existing form
          <form onSubmit={handleSubmit}>
            {showSummary ? renderSummary() : renderForm()}
          </form>
        )}

        {/* Using the modal without isSkipping prop */}
        <CongratulationsModal 
          isOpen={showModal} 
          onClose={handleCloseModal} 
          redirectPath="/"
        />
      </div>
    </div>
  );
};

export default LibraryFeedback;