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
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4">
      <Navbar />
      <div className="flex justify-center items-start mt-12">
        <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 my-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full md:w-3/5 mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl text-white font-semibold">Customer Profile</h1>
                  <p className="text-sm text-white/80">Help us serve you better</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-8">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-4 text-sm">
                  {steps.map((s, index) => (
                    <React.Fragment key={s.id}>
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center
                          ${step === s.id 
                            ? "bg-blue-500 text-white"
                            : step > s.id
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"}
                        `}>
                          {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                        </div>
                        <span className={`ml-2 ${step === s.id ? "text-blue-600" : "text-gray-600"}`}>
                          {s.name}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`h-0.5 w-12 ${
                          step > index + 1 ? "bg-green-500" : "bg-gray-200"
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="max-w-xl mx-auto space-y-4">
                {step === 1 && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Organization Name</label>
                      <input
                        type="text"
                        name="organizationName"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Contact Information</label>
                      <input
                        type="text"
                        name="contactInfo"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    {classifications.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => handleInputChange({
                          target: { name: "classification", value: item.name }
                        })}
                        className={`p-4 rounded-lg border cursor-pointer transition-all
                          ${formData.classification === item.name 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-200'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Gender</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Male', 'Female'].map(gender => (
                          <div
                            key={gender}
                            onClick={() => handleInputChange({ target: { name: 'sex', value: gender } })}
                            className={`py-2 px-4 rounded-lg cursor-pointer text-center text-sm
                              ${formData.sex === gender 
                                ? 'bg-blue-50 text-blue-600 border border-blue-500' 
                                : 'bg-gray-50 text-gray-600 border border-gray-200'}
                            `}
                          >
                            {gender}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Age Group</label>
                      <select
                        name="ageGroup"
                        className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.ageGroup}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Age Group</option>
                        {ageGroups.map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isFirstVisit"
                            className="w-4 h-4 text-blue-600 rounded"
                            checked={formData.isFirstVisit}
                            onChange={handleInputChange}
                          />
                          <span className="ml-2 text-sm text-gray-600">First Visit</span>
                        </label>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isPwd"
                            className="w-4 h-4 text-blue-600 rounded"
                            checked={formData.isPwd}
                            onChange={handleInputChange}
                          />
                          <span className="ml-2 text-sm text-gray-600">Person with Disability</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Education Level</label>
                      <select
                        name="educationLevel"
                        className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.educationLevel}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Education Level</option>
                        {educationLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-10 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-2 text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 rounded-lg ${
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
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-green-600"
                  >
                    Submit Profile
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="hidden md:block w-2/5 relative rounded-xl overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100">
            <img 
              src={feedback} 
              alt="Customer Service" 
              className="w-full h-full object-contain p-8" 
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Why we ask?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Your Information
            </h2>
            <button
              onClick={() => setShowSummary(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Personal Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
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
              <h3 className="text-sm font-medium text-gray-900 mb-2">Classification</h3>
              <div className="bg-gray-50 rounded-lg p-4">
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
              <h3 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
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
                    <FiCheckSquare className="text-blue-500 w-4 h-4" />
                    <span className="text-sm">First Visit</span>
                  </div>
                )}
                {formData.isPwd && (
                  <div className="flex items-center gap-2">
                    <FiCheckSquare className="text-blue-500 w-4 h-4" />
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
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Edit Response
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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