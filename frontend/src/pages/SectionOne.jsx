import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Briefcase, User, School, Globe, CheckCircle, Info, Home, Phone, Mail, UserCheck, Calendar, Book, Smile, ArrowRight, ArrowLeft } from 'lucide-react';
import dostbackground from '../assets/dostbg.jpg';

const SectionOne = () => {
  const [searchParams] = useSearchParams();
  const staffVisitId = searchParams.get("staffVisitId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staffVisit: staffVisitId || "",
    name: "",
    organizationName: "",
    address: "",
    contactInfo: "",
    classification: "",
    professionalSpecify: "",
    othersSpecify: "",
    isFirstVisit: false,
    sex: "",
    ageGroup: "",
    isPwd: false,
    educationLevel: "",
    educationOthersSpecify: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // Step state for multi-step form

  const steps = [
    { id: 1, name: "Basic Information" },
    { id: 2, name: "Classification" },
    { id: 3, name: "Personal Information" },
  ];

  const classifications = [
    { name: "Owner of a business", icon: <Briefcase className="w-6 h-6 text-blue-600" /> },
    { name: "Employee of a business", icon: <User className="w-6 h-6 text-blue-600" /> },
    { name: "Government employee", icon: <School className="w-6 h-6 text-blue-600" /> },
    { name: "Professional", icon: <CheckCircle className="w-6 h-6 text-blue-600" /> },
    { name: "Overseas Filipino Worker", icon: <Globe className="w-6 h-6 text-blue-600" /> },
    { name: "Not employed", icon: <Info className="w-6 h-6 text-blue-600" /> },
    { name: "Others", icon: <Info className="w-6 h-6 text-blue-600" /> },
  ];

  const ageGroups = [
    "15 & below",
    "16-20",
    "21-30",
    "31-40",
    "41-50",
    "51-59",
    "60 & above",
  ];

  const educationLevels = [
    "Elementary",
    "High School",
    "College",
    "Masters/ PhD.",
    "Others",
  ];

  useEffect(() => {
    if (staffVisitId) {
      setFormData((prev) => ({ ...prev, staffVisit: staffVisitId }));
    }
  }, [staffVisitId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/customer-profiles",
        formData
      );
      setSuccess(true);
      setError("");
      navigate(
        `/customer-feedback?customerProfileId=${response.data._id}&staffVisitId=${staffVisitId}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${dostbackground})` }}>
      {/* Overlay with multiple layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-blue-900/95" />
      
      {/* Pattern Overlay - adds subtle texture */}
      <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
           style={{
             backgroundImage: `url('/api/placeholder/1920/1080')`,
             backgroundSize: 'cover'
           }} />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                {steps.map((s, index) => (
                  <div key={s.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        step === s.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {s.id}
                    </div>
                    <div
                      className={`ml-2 text-sm font-medium ${
                        step === s.id ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {s.name}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="mx-2 w-8 h-0.5 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2 text-blue-800 flex items-center justify-center gap-2">
                <UserCheck className="w-8 h-8 text-blue-600" />
                Customer Profile Form
              </h1>
              <p className="text-gray-600">Please fill in your information below</p>
            </div>

            {error && (
              <div className="flex items-center bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11h-2v-2h2v2zm0-4h-2V7h2v2z" /></svg>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11h-2v-2h2v2zm0-4h-2V7h2v2z" /></svg>
                <p className="text-green-700">Profile created successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Home className="w-6 h-6 text-blue-600" />
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                        <input
                          type="text"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                          rows="2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                        <input
                          type="text"
                          name="contactInfo"
                          value={formData.contactInfo}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Classification */}
              {step === 2 && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Classification
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Classification</label>
                      <select
                        name="classification"
                        value={formData.classification}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Classification</option>
                        {classifications.map((item) => (
                          <option key={item.name} value={item.name}>{item.name}</option>
                        ))}
                      </select>
                    </div>

                    {formData.classification === "Professional" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify Professional Type</label>
                        <input
                          type="text"
                          name="professionalSpecify"
                          value={formData.professionalSpecify}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    )}

                    {formData.classification === "Others" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify Other Classification</label>
                        <input
                          type="text"
                          name="othersSpecify"
                          value={formData.othersSpecify}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Personal Information */}
              {step === 3 && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Smile className="w-6 h-6 text-blue-600" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          name="isFirstVisit"
                          checked={formData.isFirstVisit}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label className="text-gray-700">First Visit</label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                        <select
                          name="sex"
                          value={formData.sex}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <select
                          name="ageGroup"
                          value={formData.ageGroup}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Age Group</option>
                          {ageGroups.map((age) => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          name="isPwd"
                          checked={formData.isPwd}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label className="text-gray-700">Person with Disability</label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                        <select
                          name="educationLevel"
                          value={formData.educationLevel}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select Education Level</option>
                          {educationLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      {formData.educationLevel === "Others" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Specify Other Education Level</label>
                          <input
                            type="text"
                            name="educationOthersSpecify"
                            value={formData.educationOthersSpecify}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;