import React from 'react';
import { 
  FiPrinter, FiUsers, FiBarChart2, FiDatabase, FiX
} from 'react-icons/fi';
import { PrintService } from './PrintService';
import { CheckCircle } from 'lucide-react';

const DetailsModal = ({ isOpen, onClose, feedback }) => {
  // Ensure we're using the specific customer's feedback data
  const customerFeedback = feedback?.customerFeedback || {};
  
  console.log('Feedback in Modal:', feedback); // Debugging line
  if (!feedback) return null;

  // Helper function to render checkboxes
  const renderServiceCheckbox = (isChecked, label, index) => (
    <div key={`service-${label}-${index}`} className="flex items-center mb-2">
      <div className="flex items-center">
        <span className="mr-2">[{isChecked ? '✓' : ' '}]</span>
        <span>{label}</span>
      </div>
    </div>
  );

  // Function to handle technology transfer services
  const renderTechnoTransferServices = (technoTransfer) => {
    if (!technoTransfer) return null;
    
    const sectors = {
      agriHorticulture: "Agriculture & Horticulture",
      aquacultureMarine: "Aquaculture & Marine",
      furniture: "Furniture",
      foodProcessing: "Food Processing",
      giftsHousewaresDecors: "Gifts, Housewares & Decors",
      healthAndPharma: "Health & Pharmaceutical",
      ict: "ICT",
      metalsAndEngineering: "Metals & Engineering"
    };

    return (
      <div>
        <h6 className="font-semibold">Technology Transfer & Commercialization (SETUP/GIA)</h6>
        <div className="flex flex-col">
          {Object.entries(sectors).map(([key, label], index) => (
            renderServiceCheckbox(technoTransfer.sectors[key], label, `transfer-${index}`)
          ))}
          {technoTransfer.othersSpecify && (
            renderServiceCheckbox(true, `Others: ${technoTransfer.othersSpecify}`, 'transfer-others')
          )}
        </div>
      </div>
    );
  };

  // Function to handle technical consultancy services
  const renderTechnoConsultancyServices = (technoConsultancy) => {
    if (!technoConsultancy) return null;

    const services = {
      mpex: "MPEX",
      cape: "CAPE",
      cpe: "CPE",
      energyAudit: "Energy Audit"
    };

    return (
      <div>
        <h6 className="font-semibold">Technical Consultancy</h6>
        <div className="flex flex-col">
          {Object.entries(services).map(([key, label], index) => (
            renderServiceCheckbox(technoConsultancy.services[key], label, `consultancy-${index}`)
          ))}
          {technoConsultancy.othersSpecify && (
            renderServiceCheckbox(true, `Others: ${technoConsultancy.othersSpecify}`, 'consultancy-others')
          )}
        </div>
      </div>
    );
  };

  // Function to handle additional services
  const renderAdditionalServices = (staffVisit) => {
    if (!staffVisit) return null;

    const additionalServices = [
      { key: 'projectProposalPreparation', label: 'Project Proposal Preparation' },
      { key: 'packagingAndLabeling', label: 'Packaging and Labeling' },
      { key: 'technologyTraining', label: 'Technology Training' },
      { key: 'scholarship', label: 'Scholarship' },
      { key: 'library', label: 'Library Services', isObject: true },
      { key: 'laboratory', label: 'Laboratory Services', isObject: true }
    ];

    return (
      <div className="mb-6 border-b pb-4">
        <h6 className="text-lg font-semibold mb-4">Additional Services</h6>
        <div className="flex flex-col">
          {additionalServices.map(({ key, label, isObject }) => (
            renderServiceCheckbox(
              isObject ? staffVisit[key]?.enabled : staffVisit[key],
              label
            )
          ))}
          {staffVisit.others?.enabled && (
            renderServiceCheckbox(true, `Others: ${staffVisit.others.specify}`, 'others')
          )}
        </div>
      </div>
    );
  };

  // Render satisfaction ratings based on the feedback passed
  const renderSatisfactionRatings = () => {
    // Use the specific customer's satisfaction ratings
    const satisfactionData = customerFeedback.satisfaction || {};
    
    const satisfactionItems = [
      { key: 'speedAndTimeliness', label: 'Speed and Timeliness of Service' },
      { key: 'qualityOfService', label: 'Quality of Service' },
      { key: 'relevanceOfService', label: 'Relevance of Service' },
      { key: 'staffCompetence', label: 'Staff Knowledge and Competence' },
      { key: 'staffAttitude', label: 'Staff Attitude and Courtesy' },
      { key: 'overallPerception', label: 'Overall Customer Experience' }
    ];

    // Fixed rating scale - now correctly maps 1 to Outstanding and 6 to Very Dissatisfied
    const getRatingLabel = (value) => {
      switch (value) {
        case 6: return 'Outstanding';
        case 5: return 'Very Satisfied';
        case 4: return 'Satisfied';
        case 3: return 'Neutral';
        case 2: return 'Dissatisfied';
        case 1: return 'Very Dissatisfied';
        default: return 'Not Rated';
      }
    };

    // Updated color scheme to match the correct rating values
    const getRatingColor = (value) => {
      switch (value) {
        case 6: return 'bg-emerald-500';
        case 5: return 'bg-green-500';
        case 4: return 'bg-blue-500';
        case 3: return 'bg-yellow-500';
        case 2: return 'bg-orange-500';
        case 1: return 'bg-red-500';
        default: return 'bg-gray-200';
      }
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 rounded-l-lg">
                Drivers of Satisfaction
              </th>
              {[6, 5, 4, 3, 2, 1].map((value) => (
                <th key={value} className="px-2 py-3 text-center">
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {getRatingLabel(value)}
                  </div>
                  <div className="text-xs text-gray-500">({value})</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satisfactionItems.map(({ key, label }) => {
              // Get this specific customer's rating for each item
              const rating = Number(satisfactionData[key]);
              return (
                <tr key={key} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-4 px-4 text-sm text-gray-700">{label}</td>
                  {[6, 5, 4, 3, 2, 1].map((value) => (
                    <td key={`${key}-${value}`} className="px-2 text-center">
                      <div className="flex justify-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-200
                          ${rating === value 
                            ? `${getRatingColor(value)} border-transparent` 
                            : 'border-gray-200 bg-white'}`}
                        >
                          {rating === value && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Recommendation Score */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
          <h6 className="text-sm font-semibold text-gray-700 mb-4">
            Likelihood to Recommend DOST's Services
          </h6>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 grid grid-cols-11 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                  // Use this specific customer's recommendation score
                  const isSelected = customerFeedback.recommendationScore === score;
                  return (
                    <div
                      key={score}
                      className={`relative h-12 flex items-center justify-center rounded-md border-2 transition-all
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 bg-white'}`}
                    >
                      <span className={`text-sm font-medium
                        ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}
                      >
                        {score}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not at all likely</span>
              <span>Extremely likely</span>
            </div>
          </div>
        </div>

        {/* Customer Comments/Suggestions */}
        <div className="mt-6 bg-white p-6 rounded-xl border border-gray-200">
          <h6 className="text-sm font-semibold text-gray-700 mb-3">
            Customer Comments and Suggestions
          </h6>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[100px]">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {customerFeedback.suggestions || 'No comments provided'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    PrintService.printFeedbackForm(feedback);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto no-print">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto modal-content transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-t-xl border-b border-blue-200">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">CUSTOMER SATISFACTION FEEDBACK FORM</h1>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FiPrinter className="mr-2" /> Print Form
              </button>
            </div>
            <div className="flex justify-between mt-6">
              <div className="flex-1">
                <p className="font-semibold text-gray-700">DEPARTMENT OF SCIENCE AND TECHNOLOGY</p>
                <p className="text-gray-600">MIMAROPA REGION</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">TO F1</p>
                <p className="text-gray-600">Rev 1/04-25-16</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-4 bg-white/50 p-3 rounded-lg">
              <div className="flex-1">
                <p><strong>Date of visit:</strong> {new Date(feedback.dateOfVisit).toLocaleDateString()}</p>
              </div>
              <div className="flex-1 sm:text-right">
                <p><strong>Attending Staff:</strong> {feedback.attendingStaff || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto bg-gray-50">
            {/* Navigation tabs */}
            <div className="sticky top-0 bg-gray-50 py-2 z-10 border-b border-gray-200 -mt-2 -mx-6 px-6">
              <div className="flex overflow-x-auto space-x-4 pb-2">
                <a href="#services" className="text-blue-600 font-medium whitespace-nowrap px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">Services</a>
                <a href="#profile" className="text-blue-600 font-medium whitespace-nowrap px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">Customer Profile</a>
                <a href="#feedback" className="text-blue-600 font-medium whitespace-nowrap px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">Feedback</a>
                <a href="#library" className="text-blue-600 font-medium whitespace-nowrap px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">Library Users</a>
              </div>
            </div>

            {/* Services Section */}
            <section id="services" className="bg-white rounded-xl shadow-md p-6">
              <h6 className="text-xl font-semibold mb-4 flex items-center text-gray-800 border-b pb-2">
                <FiDatabase className="mr-2 text-blue-600" /> SERVICES AVAILED
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  {renderTechnoTransferServices(feedback.technoTransfer)}
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 hover:shadow-md transition-shadow">
                  {renderTechnoConsultancyServices(feedback.technoConsultancy)}
                </div>
              </div>
              <div className="mt-6">
                {renderAdditionalServices(feedback)}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-4">
                  <p className="text-sm font-medium text-gray-700">How did you know of our services?</p>
                  <p className="font-medium bg-white p-2 rounded mt-1 border border-gray-100">{feedback.referralSource || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Customer Profile */}
            <section id="profile" className="bg-white rounded-xl shadow-md p-6">
              <h6 className="text-xl font-semibold mb-4 flex items-center text-gray-800 border-b pb-2">
                <FiUsers className="mr-2 text-blue-600" /> CUSTOMER'S PROFILE
              </h6>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600">Full Name:</p>
                      <p className="font-medium text-gray-800">{feedback.customerProfile?.name || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600">Organization:</p>
                      <p className="font-medium text-gray-800">{feedback.customerProfile?.organizationName || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600">Address:</p>
                      <p className="font-medium text-gray-800">{feedback.customerProfile?.address || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600">Contact:</p>
                      <p className="font-medium text-gray-800">{feedback.customerProfile?.contactInfo || 'N/A'}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Classification:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
                        {[
                          'Student',
                          'Owner of a business',
                          'Employee of a business',
                          'Government employee',
                          'Professional',
                          'Overseas Filipino Worker',
                          'Not employed',
                          'Others'
                        ].map((item) => (
                          <div key={item} className="flex items-center">
                            <div className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${feedback.customerProfile?.classification === item ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}>
                              {feedback.customerProfile?.classification === item && <span className="text-xs">✓</span>}
                            </div>
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">First Visit:</p>
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full mr-2 ${feedback.customerProfile?.isFirstVisit ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                        <span className="text-sm">Yes</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Sex:</p>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${feedback.customerProfile?.sex === 'Male' ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                          <span className="text-sm">Male</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${feedback.customerProfile?.sex === 'Female' ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                          <span className="text-sm">Female</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">PWD:</p>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${feedback.customerProfile?.isPWD ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                          <span className="text-sm">Yes</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${!feedback.customerProfile?.isPWD ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                          <span className="text-sm">No</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Age Group:</p>
                      <div className="grid grid-cols-2 gap-y-1">
                        {[
                          '15 & below',
                          '16-20',
                          '21-30',
                          '31-40',
                          '41-50',
                          '51-59',
                          '60 & above'
                        ].map((age) => (
                          <div key={age} className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${feedback.customerProfile?.ageGroup === age ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                            <span className="text-sm">{age}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Level of Education:</p>
                      <div className="space-y-1">
                        {[
                          'Elementary',
                          'High School',
                          'College',
                          'Masters/PhD',
                          'Others'
                        ].map((level) => (
                          <div key={level} className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${feedback.customerProfile?.educationLevel === level ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                            <span className="text-sm">{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Satisfaction Ratings - Section 2 */}
            <section id="feedback" className="bg-white rounded-xl shadow-md p-6">
              <h6 className="text-xl font-semibold mb-4 flex items-center text-gray-800 border-b pb-2">
                <FiBarChart2 className="mr-2 text-blue-600" /> CUSTOMER EVALUATION/FEEDBACK
              </h6>
              {renderSatisfactionRatings()}
            </section>

            {/* Library Users Section - Section 3 */}
            <section id="library" className="bg-white rounded-xl shadow-md p-6">
              <h6 className="text-xl font-semibold mb-4 flex items-center text-gray-800 border-b pb-2">
                <FiDatabase className="mr-2 text-blue-600" /> FOR LIBRARY USERS ONLY
              </h6>
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-5 rounded-lg border border-indigo-100">
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Queries Answered:</p>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${feedback.libraryFeedback?.queriesAnswered ? 'bg-green-500 text-white' : 'border border-gray-300'}`}>
                        {feedback.libraryFeedback?.queriesAnswered && <span className="text-xs">✓</span>}
                      </div>
                      <span>Yes</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${!feedback.libraryFeedback?.queriesAnswered ? 'bg-red-500 text-white' : 'border border-gray-300'}`}>
                        {!feedback.libraryFeedback?.queriesAnswered && <span className="text-xs">✓</span>}
                      </div>
                      <span>No</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-sm font-medium text-gray-700 mb-3">Please specify subject of interest:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {key: 'agriHorticulture', label: 'Agriculture & Horticulture'},
                      {key: 'aquacultureMarine', label: 'Aquaculture & Marine'},
                      {key: 'furniture', label: 'Furniture'},
                      {key: 'foodProcessing', label: 'Food Processing'},
                      {key: 'giftsHousewareDecors', label: 'Gifts, Housewares & Decors'},
                      {key: 'healthAndPharma', label: 'Health & Pharmaceutical'},
                      {key: 'ict', label: 'ICT'},
                      {key: 'metalsAndEngineering', label: 'Metals & Engineering'},
                      {key: 'others', label: 'Others'}
                    ].map(({key, label}) => (
                      <div key={key} className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                        <div 
                          className={`w-5 h-5 flex items-center justify-center mr-2 rounded
                            ${feedback.libraryFeedback?.subjectsOfInterest?.[key] 
                              ? 'bg-blue-500 text-white' 
                              : 'border border-gray-300'}`
                          }
                        >
                          {feedback.libraryFeedback?.subjectsOfInterest?.[key] && <span className="text-xs">✓</span>}
                        </div>
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal; 