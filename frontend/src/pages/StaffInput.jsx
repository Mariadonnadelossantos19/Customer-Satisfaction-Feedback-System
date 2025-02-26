import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUser, FiInfo, FiCheckSquare, FiAlertCircle, FiX, FiEdit2 } from "react-icons/fi";
import { Tooltip } from 'react-tooltip';
import Navbar from "../Components/Layout/Navbar";
import dostbackground from "../assets/dostbg.jpg"
import staffGif from "../assets/feedback.gif";
import { ArrowLeft, ArrowRight, Database, Atom, Code, Microscope, Server, Cpu, BrainCircuit } from 'lucide-react';
import Confetti from "react-confetti";

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

const DataPoints = () => {
  const points = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {points.map((point) => (
        <div
          key={point.id}
          className="absolute rounded-full bg-blue-400"
          style={{
            width: `${point.size}px`,
            height: `${point.size}px`,
            left: `${point.x}%`,
            top: `${point.y}%`,
            opacity: 0.5,
            animation: `float ${point.duration}s infinite alternate ease-in-out`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px); }
        }
      `}</style>
    </div>
  );
};

const CircuitLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg width="100%" height="100%" className="opacity-10">
      <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M20 5 L80 5 L80 20 L95 20 L95 80 L80 80 L80 95 L20 95 L20 80 L5 80 L5 20 L20 20 Z" 
              fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500" />
        <circle cx="50" cy="50" r="3" className="fill-cyan-500" />
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
    </svg>
  </div>
);

const StaffInput = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const initialFormState = {
    dateOfVisit: "",
    attendingStaff: "",
    serviceInquired: "",
    tna: false,
    technoTransfer: {
      enabled: false,
      sectors: {
        foodProcessing: false,
        metalsAndEngineering: false,
        giftsHousewaresDecors: false,
        healthAndPharma: false,
        agriHorticulture: false,
        ict: false,
        aquacultureMarine: false,
        furniture: false,
        others: false,
      },
      othersSpecify: "",
    },
    technoConsultancy: {
      enabled: false,
      services: {
        mpex: false,
        cape: false,
        cpt: false,
        energyAudit: false,
        others: false,
      },
      othersSpecify: "",
    },
    projectProposalPreparation: false,
    packagingAndLabeling: false,
    technologyTraining: false,
    technologyClinics: {
      enabled: false,
      name: "Technology Clinics/Forum",
    },
    scholarship: false,
    laboratory: {
      enabled: false,
      name: "Laboratory (Metrology/Microbiology)",
    },
    library: {
      enabled: false,
      name: "",
    },
    others: {
      enabled: false,
      specify: "",
    },
    referralSource: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (e) => {
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

  const handleNestedChange = (section, subsection, field) => (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: checked,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/staff-visits",
        formData
      );
      setSuccess("Staff visit record created successfully!");
      console.log("Form submitted successfully, showing confetti!");
      setShowConfetti(true);
      
      // Reset confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      navigate(`/SectionOne?staffVisitId=${response.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting the form"
      );
    } finally {
      setIsLoading(false);
      setShowSummary(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-900 py-12 px-4 relative">
      {/* Animated Data Points Background */}
      <DataPoints />
      
      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 bg-indigo-950/80 mix-blend-overlay pointer-events-none" />
      
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} />}
      <Navbar />
      <div className="flex justify-center items-start mt-8 relative z-10">
        <div className="max-w-5xl w-full">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-200/30 relative">
            <CircuitLines />
            
            {/* Header with Sci-Tech Design */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 px-8 py-8 relative overflow-hidden">
              {/* Animated Tech Pattern Overlay */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <pattern id="tech-grid" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(45)">
                    <rect width="2" height="2" fill="white" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#tech-grid)" />
                </svg>
              </div>
              
              {/* Header Content */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    <span className="font-mono">DOST</span> Visit Data Collection
                  </h1>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 my-2"></div>
                  <p className="text-blue-100 mt-2 flex items-center gap-2">
                    <Database className="w-4 h-4" /> 
                    <span>Collecting service utilization metrics for enhanced DOST performance analysis</span>
                  </p>
                </div>
                {/* GIF Container with Tech Frame */}
                <div className="hidden md:block relative">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/60 animate-pulse"></div>
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md flex items-center justify-center p-1">
                    <img 
                      src={staffGif} 
                      alt="Staff Service Animation" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-cyan-500 rounded-full px-2 py-0.5 text-xs font-mono text-white animate-pulse">
                    LIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar with Glowing Effect */}
            <div className="w-full bg-gray-200 h-1.5 relative overflow-hidden">
              <div 
                className="h-full transition-all duration-500 relative z-10 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
                style={{ width: `${((currentStep - 1) * 100) / 3}%` }}
              />
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-500 blur-md opacity-70 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
                style={{ width: `${((currentStep - 1) * 100) / 3}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="p-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" />
                    <span>Date of Visit</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfVisit"
                      value={formData.dateOfVisit}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-indigo-100 
                      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                      placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                    />
                    <div className="absolute inset-0 border border-indigo-200 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 flex items-center gap-2">
                    <FiUser className="text-indigo-500" />
                    <span>Attending Staff</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="attendingStaff"
                      value={formData.attendingStaff}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-indigo-100 
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                        placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                      placeholder="Enter staff name"
                    />
                    <div className="absolute inset-0 border border-indigo-200 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Primary Services */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100">
                    <h3 className="text-gray-700 font-medium">Primary Services</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* TNA */}
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="tna"
                        checked={formData.tna}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Technology Needs Assessment (TNA)</span>
                    </label>

                    {/* Technology Transfer */}
                    <div className="border border-gray-100 rounded-lg">
                      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="technoTransfer.enabled"
                          checked={formData.technoTransfer.enabled}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600 font-medium">Technology Transfer</span>
                      </label>
                      
                      {formData.technoTransfer.enabled && (
                        <div className="px-4 pb-4 pt-2">
                          <div className="grid grid-cols-2 gap-3">
                            {Object.keys(formData.technoTransfer.sectors).map((sector) => (
                              sector !== 'others' && sector !== 'othersSpecify' && (
                                <label key={sector} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={formData.technoTransfer.sectors[sector]}
                                    onChange={handleNestedChange('technoTransfer', 'sectors', sector)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-500">
                                    {sector.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </label>
                              )
                            ))}
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.technoTransfer.sectors.others}
                                onChange={handleNestedChange('technoTransfer', 'sectors', 'others')}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-500">Others</span>
                            </label>
                            {formData.technoTransfer.sectors.others && (
                              <div className="col-span-2 mt-2">
                                <input
                                  type="text"
                                  name="technoTransfer.othersSpecify"
                                  value={formData.technoTransfer.othersSpecify}
                                  onChange={handleChange}
                                  placeholder="Please specify other sector"
                                  className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Technology Consultancy */}
                    <div className="border border-gray-100 rounded-lg">
                      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="technoConsultancy.enabled"
                          checked={formData.technoConsultancy.enabled}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600 font-medium">Technology Consultancy</span>
                      </label>
                      
                      {formData.technoConsultancy.enabled && (
                        <div className="px-4 pb-4 pt-2">
                          <div className="grid grid-cols-2 gap-3">
                            {Object.keys(formData.technoConsultancy.services).map((service) => (
                              service !== 'others' && service !== 'othersSpecify' && (
                                <label key={service} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={formData.technoConsultancy.services[service]}
                                    onChange={handleNestedChange('technoConsultancy', 'services', service)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-500">{service.toUpperCase()}</span>
                                </label>
                              )
                            ))}
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.technoConsultancy.services.others}
                                onChange={handleNestedChange('technoConsultancy', 'services', 'others')}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-500">Others</span>
                            </label>
                            {formData.technoConsultancy.services.others && (
                              <div className="col-span-2 mt-2">
                                <input
                                  type="text"
                                  name="technoConsultancy.othersSpecify"
                                  value={formData.technoConsultancy.othersSpecify}
                                  onChange={handleChange}
                                  placeholder="Please specify other service"
                                  className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100">
                    <h3 className="text-gray-700 font-medium">Additional Services</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Project Proposal */}
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="projectProposalPreparation"
                        checked={formData.projectProposalPreparation}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Project Proposal Preparation</span>
                    </label>

                    {/* Packaging and Labeling */}
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="packagingAndLabeling"
                        checked={formData.packagingAndLabeling}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Packaging and Labeling</span>
                    </label>

                    {/* Technology Training */}
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="technologyTraining"
                        checked={formData.technologyTraining}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Technology Training</span>
                    </label>

                    {/* Scholarship */}
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="scholarship"
                        checked={formData.scholarship}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Scholarship</span>
                    </label>

                    {/* Technology Clinics */}
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="technologyClinics.enabled"
                        checked={formData.technologyClinics.enabled}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Technology Clinics/Forum</span>
                    </label>

                    {/* Laboratory */}
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="laboratory.enabled"
                        checked={formData.laboratory.enabled}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Laboratory (Metrology/Microbiology)</span>
                    </label>

                    {/* Others */}
                    <div className="border border-gray-100 rounded-lg">
                      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="others.enabled"
                          checked={formData.others.enabled}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600 font-medium">Others</span>
                      </label>
                      
                      {formData.others.enabled && (
                        <div className="px-4 pb-4">
                          <input
                            type="text"
                            name="others.specify"
                            value={formData.others.specify}
                            onChange={handleChange}
                            placeholder="Please specify"
                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Source Field */}
              <div className="mt-6">
                <label className="block text-sm text-gray-600 mb-1.5">
                  How did you learn about DOST Services? <span className="text-red-500">*</span>
                </label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                    text-gray-600 bg-white"
                >
                  <option value="">Select referral source</option>
                  <option value="DOST Website">DOST Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Friends/Relatives">Friends/Relatives</option>
                  <option value="Print Media">Print Media</option>
                  <option value="Radio/TV">Radio/TV</option>
                  <option value="DOST Staff">DOST Staff</option>
                  <option value="LGU">LGU</option>
                  <option value="DTI">DTI</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 text-base bg-gradient-to-r from-blue-600 to-blue-700 
                    hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900
                    text-white font-semibold rounded-lg flex items-center justify-center gap-2
                    transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                    disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg 
                        className="animate-spin h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <FiCheckSquare className="w-5 h-5" />
                      Submit Form
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Summary Modal */}
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
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date of Visit:</span>
                        <span className="text-sm font-medium">{formData.dateOfVisit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Attending Staff:</span>
                        <span className="text-sm font-medium">{formData.attendingStaff}</span>
                      </div>
                    </div>
                  </div>

                  {/* Services Selected */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Services Selected</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {/* Primary Services */}
                      {formData.tna && (
                        <div className="flex items-center gap-2">
                          <FiCheckSquare className="text-blue-500 w-4 h-4" />
                          <span className="text-sm">Technology Needs Assessment (TNA)</span>
                        </div>
                      )}
                      
                      {formData.technoTransfer.enabled && (
                        <div className="ml-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <FiCheckSquare className="text-blue-500 w-4 h-4" />
                            <span className="text-sm font-medium">Technology Transfer</span>
                          </div>
                          <div className="ml-4 grid grid-cols-2 gap-2">
                            {Object.entries(formData.technoTransfer.sectors)
                              .filter(([key, value]) => value && key !== 'others')
                              .map(([key]) => (
                                <span key={key} className="text-sm text-gray-600">
                                  • {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Referral Source */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Referral Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Learned about DOST through:</span>
                        <span className="text-sm font-medium">{formData.referralSource}</span>
                      </div>
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
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? "Submitting..." : "Confirm & Submit"}
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInput;
