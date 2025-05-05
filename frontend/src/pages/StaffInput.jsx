import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUser, FiInfo, FiCheckSquare, FiAlertCircle, FiX, FiEdit2 } from "react-icons/fi";
import { Tooltip } from 'react-tooltip';
import Navbar from "../Components/Layout/Navbar";
/*import dostbackground from "../assets/dostbg.jpg"*/
/*import staffGif from "../assets/feedback.gif";*/
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

  // Render content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 flex items-center gap-2">
                  <FiCalendar className="text-cyan-600" />
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 
                    focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 
                    placeholder-gray-400 bg-white/90"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5 flex items-center gap-2">
                  <FiUser className="text-cyan-600" />
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 
                      focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 
                      placeholder-gray-400 bg-white/90"
                    placeholder="Enter staff name"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <BrainCircuit className="text-blue-500 w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Science & Technology Services</h3>
                <p className="text-sm text-blue-600">
                  Help us understand your visit by completing this 3-step form. Your input improves our services.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary Services */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 flex items-center gap-2">
                  <Atom className="w-4 h-4 text-cyan-600" />
                  <h3 className="text-gray-700 font-medium">Primary Services</h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* TNA */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="tna"
                      checked={formData.tna}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Technology Needs Assessment (TNA)</span>
                  </label>

                  {/* Technology Transfer */}
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <label className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="technoTransfer.enabled"
                        checked={formData.technoTransfer.enabled}
                        onChange={handleChange}
                        className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">Technology Transfer</span>
                    </label>
                    
                    <div className="px-4 pb-4 pt-2 bg-gray-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.keys(formData.technoTransfer.sectors).map((sector) => (
                          sector !== 'others' && sector !== 'othersSpecify' && (
                            <label key={sector} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.technoTransfer.sectors[sector]}
                                onChange={handleNestedChange('technoTransfer', 'sectors', sector)}
                                className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
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
                            className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
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
                  </div>

                  {/* Technology Consultancy */}
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <label className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="technoConsultancy.enabled"
                        checked={formData.technoConsultancy.enabled}
                        onChange={handleChange}
                        className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">Technology Consultancy</span>
                    </label>
                    
                    <div className="px-4 pb-4 pt-2 bg-gray-50">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.keys(formData.technoConsultancy.services).map((service) => (
                          service !== 'others' && service !== 'othersSpecify' && (
                            <label key={service} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.technoConsultancy.services[service]}
                                onChange={handleNestedChange('technoConsultancy', 'services', service)}
                                className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
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
                            className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
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
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-600" />
                  <h3 className="text-gray-700 font-medium">Additional Services</h3>
                </div>
                <div className="p-5 space-y-3">
                  {/* Project Proposal */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="projectProposalPreparation"
                      checked={formData.projectProposalPreparation}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Project Proposal Preparation</span>
                  </label>

                  {/* Packaging and Labeling */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="packagingAndLabeling"
                      checked={formData.packagingAndLabeling}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Packaging and Labeling</span>
                  </label>

                  {/* Technology Training */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="technologyTraining"
                      checked={formData.technologyTraining}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Technology Training</span>
                  </label>

                  {/* Scholarship */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="scholarship"
                      checked={formData.scholarship}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Scholarship</span>
                  </label>

                  {/* Technology Clinics */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="technologyClinics.enabled"
                      checked={formData.technologyClinics.enabled}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Technology Clinics/Forum</span>
                  </label>

                  {/* Laboratory */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="laboratory.enabled"
                      checked={formData.laboratory.enabled}
                      onChange={handleChange}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Laboratory (Metrology/Microbiology)</span>
                  </label>

                  {/* Others */}
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <label className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="others.enabled"
                        checked={formData.others.enabled}
                        onChange={handleChange}
                        className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">Others</span>
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
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-600" />
                <h3 className="text-gray-700 font-medium">How did you learn about us?</h3>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'DOST Website'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'DOST Website' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">DOST Website</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'Social Media'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'Social Media' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">Social Media</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'Friends/Relatives'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'Friends/Relatives' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">Friends/Relatives</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'Print Media'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'Print Media' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">Print Media</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'Radio/TV'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'Radio/TV' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">Radio/TV</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'DOST Staff'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'DOST Staff' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">DOST Staff</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'LGU'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'LGU' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">LGU</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.referralSource === 'DTI'}
                    onChange={() => handleChange({
                      target: { name: 'referralSource', value: 'DTI' }
                    })}
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">DTI</span>
                </label>

                <div className="col-span-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.referralSource.startsWith('Others:')}
                      onChange={() => {
                        if (!formData.referralSource.startsWith('Others:')) {
                          handleChange({
                            target: { name: 'referralSource', value: 'Others:' }
                          });
                        }
                      }}
                      className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Others</span>
                  </label>
                  
                  {formData.referralSource.startsWith('Others:') && (
                    <div className="mt-2 ml-10">
                      <input
                        type="text"
                        placeholder="Please specify"
                        value={formData.referralSource.replace('Others:', '').trim()}
                        onChange={(e) => handleChange({
                          target: { name: 'referralSource', value: `Others:${e.target.value}` }
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-cyan-600" />
                <h3 className="text-gray-700 font-medium">Review Your Selection</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FiCalendar className="text-cyan-600" />
                    <span>Date of Visit:</span> 
                    <span className="font-medium text-gray-700">{formData.dateOfVisit || "Not specified"}</span>
                  </p>
                  
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FiUser className="text-cyan-600" />
                    <span>Attending Staff:</span> 
                    <span className="font-medium text-gray-700">{formData.attendingStaff || "Not specified"}</span>
                  </p>
                  
                  <div className="text-sm text-gray-500 flex items-start gap-2 mt-3">
                    <Cpu className="text-cyan-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>Selected Services:</p>
                      <ul className="list-disc ml-5 mt-1 text-gray-700 space-y-1">
                        {formData.tna && <li>Technology Needs Assessment</li>}
                        {formData.technoTransfer.enabled && <li>Technology Transfer</li>}
                        {formData.technoConsultancy.enabled && <li>Technology Consultancy</li>}
                        {formData.projectProposalPreparation && <li>Project Proposal Preparation</li>}
                        {formData.packagingAndLabeling && <li>Packaging and Labeling</li>}
                        {formData.technologyTraining && <li>Technology Training</li>}
                        {formData.scholarship && <li>Scholarship</li>}
                        {formData.technologyClinics.enabled && <li>Technology Clinics/Forum</li>}
                        {formData.laboratory.enabled && <li>Laboratory Services</li>}
                        {formData.others.enabled && <li>Other: {formData.others.specify}</li>}
                        {!formData.tna && 
                         !formData.technoTransfer.enabled && 
                         !formData.technoConsultancy.enabled && 
                         !formData.projectProposalPreparation && 
                         !formData.packagingAndLabeling && 
                         !formData.technologyTraining && 
                         !formData.scholarship && 
                         !formData.technologyClinics.enabled && 
                         !formData.laboratory.enabled && 
                         !formData.others.enabled && <li className="text-gray-400">No services selected</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
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
            <div className="bg-gradient-to-r from-blue-700 to-cyan-800 px-8 py-6 relative overflow-hidden">
              {/* Simplified Tech Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <pattern id="tech-grid" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(45)">
                    <rect width="1" height="1" fill="white" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#tech-grid)" />
                </svg>
              </div>
              
              {/* Header Content */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    <span>DOST Visit Data Collection</span>
                  </h1>
                  <div className="h-0.5 w-16 bg-cyan-400/50 my-2"></div>
                  <p className="text-blue-100 mt-2 text-sm">
                    Step {currentStep} of 3: {currentStep === 1 ? 'Basic Information' : 
                      currentStep === 2 ? 'Service Selection' : 'Referral & Review'}
                  </p>
                </div>
                
                {/* Step Indicator */}
                <div className="hidden md:flex items-center gap-1">
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === step 
                          ? 'bg-cyan-500 text-white' 
                          : currentStep > step 
                            ? 'bg-cyan-200 text-cyan-800' 
                            : 'bg-blue-100/30 text-blue-200'
                      }`}
                    >
                      {currentStep > step ? (
                        <FiCheckSquare className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{step}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar with Glowing Effect */}
            <div className="w-full bg-gray-100 h-1 relative overflow-hidden">
              <div 
                className="h-full transition-all duration-500 relative z-10 bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${((currentStep) * 100) / 3}%` }}
              />
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-500 blur-sm opacity-70 bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${((currentStep) * 100) / 3}%` }}
              />
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-8 relative z-10">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className={`mt-8 flex ${currentStep > 1 ? 'justify-between' : 'justify-end'}`}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 text-sm font-medium flex items-center gap-2 text-gray-600 bg-gray-100 
                    hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-5 py-2.5 text-sm font-medium flex items-center gap-2 text-white 
                    bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 
                    rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-5 py-2.5 text-sm font-medium flex items-center gap-2 text-white 
                    bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 
                    rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg 
                          className="animate-spin h-4 w-4" 
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
                        Submit Form
                        <FiCheckSquare className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
  );
};

export default StaffInput;
