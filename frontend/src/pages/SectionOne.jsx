import React from 'react';
//THIS IS THE INPUT FIELD FOR CUSTOMER PROFILE
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Briefcase, User, School, Globe, CheckCircle, Info, Home, Phone, Mail, UserCheck, Calendar, Book, Smile, ArrowRight, ArrowLeft } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import Navbar from "../Components/Layout/Navbar";
import feedback from "../assets/feedback.gif"; // Consider using a more dynamic GIF or video
import { FiX } from 'react-icons/fi';
import { FiCheckSquare } from 'react-icons/fi';
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto border border-gray-100">
        {children}
        </div>
      </div>
    </div>
  );
};

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
  const [showSummary, setShowSummary] = useState(false);

  const steps = [
    { id: 1, name: "Personal Information" },
    { id: 2, name: "Classification" },
    { id: 3, name: "Basic Information" },
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
    // Clear error when user makes changes
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const handleFinalSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/customer-profiles", formData);
      if (response.data) {
        navigate(`/customer-feedback?customerProfileId=${response.data._id}&staffVisitId=${staffVisitId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while submitting the form.");
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 py-6 px-4">
      <Navbar />
      <div className="flex justify-center items-start mt-8">
        <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 my-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden w-full md:w-3/5 mx-auto border border-indigo-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5"></path>
                  <path d="M0,50 L100,50" stroke="white" strokeWidth="0.2"></path>
                  <path d="M50,0 L50,100" stroke="white" strokeWidth="0.2"></path>
                  <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.3"></circle>
                </svg>
              </div>
              <div className="flex items-center justify-center gap-3 relative z-10">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl text-white font-semibold">Customer Profile</h1>
                  <p className="text-sm text-white/80">Help us serve you better</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-8">
              <div className="flex items-center justify-center mb-10">
                <div className="relative flex items-center gap-4 text-sm">
                  {steps.map((s, index) => (
                    <React.Fragment key={s.id}>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300
                          ${step === s.id 
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-2 ring-indigo-100"
                            : step > s.id
                            ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                            : "bg-gray-100 text-gray-600"}
                        `}>
                          {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                        </div>
                        <span className={`mt-2 ${step === s.id ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                          {s.name}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="flex-1 relative">
                          <div className={`absolute top-4 -translate-y-1/2 h-0.5 w-full ${
                            step > index + 1 ? "bg-gradient-to-r from-teal-400 to-emerald-500" : "bg-gray-200"
                          }`} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="organizationName"
                          className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          placeholder="Enter organization name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Home className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="contactInfo"
                          className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                          value={formData.contactInfo}
                          onChange={handleInputChange}
                          placeholder="Phone number or email"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Classification</label>
                    <div className="grid grid-cols-2 gap-4">
                      {classifications.map((item) => (
                        <div
                          key={item.name}
                          onClick={() => handleInputChange({
                            target: { name: "classification", value: item.name }
                          })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-102
                            ${formData.classification === item.name 
                              ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500 shadow-md' 
                              : 'bg-white/50 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                              ${formData.classification === item.name ? 'bg-indigo-100' : 'bg-gray-100'}
                            `}>
                              {item.icon}
                            </div>
                            <span className={`text-sm ${formData.classification === item.name ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>
                              {item.name}
                            </span>
                          </div>
                          {formData.classification === item.name && (
                            <div className="absolute -right-1 -top-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Male', 'Female'].map(gender => (
                          <div
                            key={gender}
                            onClick={() => handleInputChange({ target: { name: 'sex', value: gender } })}
                            className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-102
                              ${formData.sex === gender 
                                ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500 shadow-md' 
                                : 'bg-white/50 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${formData.sex === gender ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}
                              `}>
                                {formData.sex === gender && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm ${formData.sex === gender ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>
                                {gender}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-gray-200 bg-white/50 hover:bg-indigo-50/30 transition-all duration-200">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isFirstVisit"
                            className="w-5 h-5 text-indigo-600 rounded-md border-gray-300 focus:ring-indigo-500"
                            checked={formData.isFirstVisit}
                            onChange={handleInputChange}
                          />
                          <span className="ml-3 text-sm text-gray-700">First Visit</span>
                        </label>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-200 bg-white/50 hover:bg-indigo-50/30 transition-all duration-200">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isPwd"
                            className="w-5 h-5 text-indigo-600 rounded-md border-gray-300 focus:ring-indigo-500"
                            checked={formData.isPwd}
                            onChange={handleInputChange}
                          />
                          <span className="ml-3 text-sm text-gray-700">Person with Disability</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-3">Age Group</label>
                      <div className="grid grid-cols-2 gap-3">
                        {ageGroups.map(age => (
                          <div
                            key={age}
                            onClick={() => handleInputChange({ target: { name: 'ageGroup', value: age } })}
                            className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-102
                              ${formData.ageGroup === age 
                                ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500 shadow-md' 
                                : 'bg-white/50 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${formData.ageGroup === age ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}
                              `}>
                                {formData.ageGroup === age && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className={`text-sm ${formData.ageGroup === age ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>
                                {age}
                              </span>
                            </div>
                            {formData.ageGroup === age && (
                              <div className="absolute -right-1 -top-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-3">Education Level</label>
                      <div className="grid grid-cols-2 gap-3">
                        {educationLevels.map(level => (
                          <div
                            key={level}
                            onClick={() => handleInputChange({ target: { name: 'educationLevel', value: level } })}
                            className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-102
                              ${formData.educationLevel === level 
                                ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500 shadow-md' 
                                : 'bg-white/50 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${formData.educationLevel === level ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}
                              `}>
                                {formData.educationLevel === level && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className={`text-sm ${formData.educationLevel === level ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>
                                {level}
                              </span>
                            </div>
                            {formData.educationLevel === level && (
                              <div className="absolute -right-1 -top-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Show text input if "Others" is selected */}
                      {formData.educationLevel === "Others" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            name="educationOthersSpecify"
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white/50"
                            value={formData.educationOthersSpecify}
                            onChange={handleInputChange}
                            placeholder="Please specify your education level"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-10 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-2.5 text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 rounded-xl transition-all duration-200 ${
                    step === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={step === 1}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                {step < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium rounded-xl flex items-center gap-2 hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-xl flex items-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Submit Profile
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="hidden md:block w-2/5 relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-800 to-indigo-800 shadow-xl border border-indigo-700/30">
            <div className="absolute inset-0 opacity-30">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="50" fill="url(#circleGradient)" />
                <g stroke="white" strokeWidth="0.1">
                  <circle cx="50" cy="50" r="10" fill="none" />
                  <circle cx="50" cy="50" r="20" fill="none" />
                  <circle cx="50" cy="50" r="30" fill="none" />
                  <circle cx="50" cy="50" r="40" fill="none" />
                </g>
              </svg>
            </div>
            <img 
              src={feedback} 
              alt="Customer Service" 
              className="w-full h-full object-contain p-8 relative z-10" 
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-2">Why we ask?</h3>
              <p className="text-sm text-indigo-100/90 leading-relaxed">
                This information helps us provide personalized services and improve your experience with us.
                All data is kept confidential and secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Confirm Your Information
            </h2>
            <button
              onClick={() => setShowSummary(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Personal Information
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-xl p-4 space-y-2 border border-indigo-100/50">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Full Name:</span>
                  <span className="text-sm font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Organization:</span>
                  <span className="text-sm font-medium">{formData.organizationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Address:</span>
                  <span className="text-sm font-medium">{formData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Contact Info:</span>
                  <span className="text-sm font-medium">{formData.contactInfo}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                Classification
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm font-medium">{formData.classification}</span>
                </div>
                {formData.classification === "Professional" && formData.professionalSpecify && (
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">Specified:</span>
                    <span className="text-sm font-medium">{formData.professionalSpecify}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                Basic Information
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-xl p-4 space-y-2 border border-indigo-100/50">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Gender:</span>
                  <span className="text-sm font-medium">{formData.sex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Age Group:</span>
                  <span className="text-sm font-medium">{formData.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Education Level:</span>
                  <span className="text-sm font-medium">{formData.educationLevel}</span>
                </div>
                {formData.isFirstVisit && (
                  <div className="flex items-center gap-2">
                    <FiCheckSquare className="text-emerald-500 w-4 h-4" />
                    <span className="text-sm">First Visit</span>
                  </div>
                )}
                {formData.isPwd && (
                  <div className="flex items-center gap-2">
                    <FiCheckSquare className="text-emerald-500 w-4 h-4" />
                    <span className="text-sm">Person with Disability</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setShowSummary(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Edit Response
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SectionOne;