import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiEye, FiPrinter, FiX, FiUsers, FiBarChart2, 
  FiCpu, FiDatabase
} from 'react-icons/fi';

const FeedbackOverview = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const staffVisitsResponse = await axios.get('http://localhost:5000/api/staff-visits/');
      
      if (staffVisitsResponse.data && Array.isArray(staffVisitsResponse.data)) {
        const staffVisitsWithFeedback = await Promise.all(
          staffVisitsResponse.data.map(async (staffVisit) => {
            try {
              const feedbackResponse = await axios.get(`http://localhost:5000/api/customer-feedback/`, {
                params: {
                  // Adjust parameters if needed
                }
              });
              console.log('Feedback Response:', feedbackResponse.data);

              // Check if feedback exists and set it, otherwise set default feedback
              const customerFeedback = feedbackResponse.data.length > 0 ? feedbackResponse.data[0] : {
                satisfaction: {
                  speedAndTimeliness: 4,
                  qualityOfService: 5,
                  relevanceOfService: 4,
                  staffCompetence: 5,
                  staffAttitude: 4,
                  overallPerception: 4.5,
                },
                recommendationScore: 9,
                suggestions: 'Great service!',
              };

              return {
                ...staffVisit,
                customerFeedback
              };
            } catch (error) {
              console.log(`Error processing staff visit ${staffVisit._id}`, error);
              return {
                ...staffVisit,
                customerFeedback: {
                  satisfaction: {
                    speedAndTimeliness: 4,
                    qualityOfService: 5,
                    relevanceOfService: 4,
                    staffCompetence: 5,
                    staffAttitude: 4,
                    overallPerception: 4.5,
                  },
                  recommendationScore: 9,
                  suggestions: 'Great service!',
                }
              };
            }
          })
        );

        setFeedbacks(staffVisitsWithFeedback);
        console.log('Fetched Feedbacks:', staffVisitsWithFeedback);
      } else {
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to fetch feedback data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailsModal(true);
  };

  const calculateAverageSatisfaction = (satisfaction) => {
    if (!satisfaction) return 'N/A';
    const values = Object.values(satisfaction);
    if (values.length === 0) return 'N/A';
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    // Get the content of the modal
    const modalContent = document.querySelector('.modal-content')?.innerHTML || '';
    const feedbackData = selectedFeedback; // Use the selected feedback data

    // Construct the content for printing
    const content = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">CUSTOMER SATISFACTION FEEDBACK FORM</h1>
        <h2 style="font-size: 20px; margin-bottom: 5px;">DEPARTMENT OF SCIENCE AND TECHNOLOGY</h2>
        <h3 style="font-size: 18px; margin-bottom: 5px;">MIMAROPA REGION</h3>
        <p style="margin-bottom: 5px;">TO F1</p>
        <p style="margin-bottom: 5px;">Rev 1/04-25-16</p>
        <p style="margin-bottom: 5px;">Date of visit/encounter: ${new Date(feedbackData.dateOfVisit).toLocaleDateString()}</p>
        <p style="margin-bottom: 20px;">Attending Staff: ${feedbackData.attendingStaff || 'N/A'}</p>

        <!-- Customer Profile Section -->
        <h4 style="margin-top: 20px;">SECTION 1: CUSTOMER'S PROFILE</h4>
        <p><strong>Full Name:</strong> ${feedbackData.customerProfile?.name || 'N/A'}</p>
        <p><strong>Organization:</strong> ${feedbackData.customerProfile?.organization || 'N/A'}</p>
        <p><strong>Address:</strong> ${feedbackData.customerProfile?.address || 'N/A'}</p>
        <p><strong>Contact:</strong> ${feedbackData.customerProfile?.contact || 'N/A'}</p>
        <p><strong>Classification:</strong> ${feedbackData.customerProfile?.classification || 'N/A'}</p>
        <p><strong>First Visit:</strong> ${feedbackData.customerProfile?.isFirstVisit ? 'Yes' : 'No'}</p>
        <p><strong>Sex:</strong> ${feedbackData.customerProfile?.sex || 'N/A'}</p>

        ${modalContent} <!-- Include the entire modal content here -->
      </div>
    `;

    // Write content to the print window
    printWindow.document.write(content);
    printWindow.document.close(); // Close the document to render the content

    // Delay the print action to ensure content is rendered
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100); // Adjust the delay as needed
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800 mb-2">
          Feedback <span className="text-cyan-600">Records</span>
        </h1>
        <p className="text-gray-500">View and analyze customer feedback submissions</p>
      </div>
      
      {/* Alert for errors */}
      {error && (
        <div className="mb-6 flex items-center p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <svg className="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6 border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-800">Feedback Records</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="spinner h-10 w-10 rounded-full border-b-2 border-t-2 border-cyan-600 animate-spin mb-4"></div>
                      <p className="text-gray-500">Loading feedback data...</p>
                    </div>
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center border-b border-gray-200 bg-white">
                    <div className="flex flex-col items-center justify-center">
                      <FiDatabase className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-2">No feedback data available</p>
                    </div>
                  </td>
                </tr>
              ) : (
                feedbacks.map((feedback) => {
                  const satisfactionAvg = calculateAverageSatisfaction(feedback.customerFeedback?.satisfaction);
                  
                  return (
                    <tr key={feedback._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {feedback.dateOfVisit ? new Date(feedback.dateOfVisit).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">{feedback.customerProfile?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{feedback.customerProfile?.organizationName || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {feedback.tna && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              TNA
                            </span>
                          )}
                          {feedback.technoTransfer?.enabled && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Tech Transfer
                            </span>
                          )}
                          {feedback.technoConsultancy?.enabled && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Consultancy
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {feedback.attendingStaff || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {satisfactionAvg !== 'N/A' ? (
                          <div className="flex items-center">
                            <div className="relative w-24 bg-gray-200 rounded-full h-2 mr-2 overflow-hidden">
                              <div 
                                className="absolute top-0 h-2 rounded-full transition-all duration-500" 
                                style={{
                                  width: `${(parseFloat(satisfactionAvg) / 5) * 100}%`,
                                  backgroundColor: parseFloat(satisfactionAvg) >= 4 
                                    ? '#10b981' 
                                    : parseFloat(satisfactionAvg) >= 3 
                                      ? '#f59e0b' 
                                      : '#ef4444'
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{satisfactionAvg}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => handleViewDetails(feedback)} 
                          className="inline-flex items-center justify-center p-2 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-full transition-colors duration-200"
                          title="View Details"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <DetailsModal
          feedback={selectedFeedback}
          onClose={() => setShowDetailsModal(false)}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

// DetailsModal Component
const DetailsModal = ({ feedback, onClose, onPrint }) => {
  console.log('Feedback in Modal:', feedback);
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
    const satisfactionData = feedback.customerFeedback?.satisfaction || {};
    const satisfactionItems = [
      { key: 'speedAndTimeliness', label: 'Speed And Timeliness' },
      { key: 'qualityOfService', label: 'Quality Of Service' },
      { key: 'relevanceOfService', label: 'Relevance Of Service' },
      { key: 'staffCompetence', label: 'Staff Competence' },
      { key: 'staffAttitude', label: 'Staff Attitude' },
      { key: 'overallPerception', label: 'Overall Perception' }
    ];

    return (
      <tbody>
        {satisfactionItems.map(({ key, label }) => {
          const rating = satisfactionData[key];
          return (
            <tr key={`satisfaction-${key}`} className="border-b">
              <td className="py-2 text-sm font-medium w-1/3">{label}</td>
              {[1, 2, 3, 4, 5].map((value) => (
                <td key={`${key}-${value}`} className="text-center py-2">
                  <div className={`w-6 h-6 mx-auto rounded-full border-2 ${
                    Number(rating) === value 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {Number(rating) === value && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto no-print">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto overflow-hidden modal-content transition-transform transform duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Customer Feedback Details</h1>
            <p className="opacity-80 mt-1">Submitted on {new Date(feedback.dateOfVisit).toLocaleDateString()}</p>
            
            <div className="flex items-center mt-4 space-x-3">
              <button
                onClick={onPrint}
                className="flex items-center bg-white text-cyan-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiPrinter className="mr-2 h-4 w-4" />
                Print Form
              </button>
              
              <button 
                onClick={onClose} 
                className="rounded-full p-2 text-white bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Customer Profile Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiUsers className="mr-2" /> Customer Profile
              </h2>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.name || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Organization</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.organizationName || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Contact</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.contact || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Classification</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.classification || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.address || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">First Visit</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.isFirstVisit ? 'Yes' : 'No'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Gender</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.sex || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Age Group</dt>
                        <dd className="text-base text-gray-900">{feedback.customerProfile?.ageGroup || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Services Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiCpu className="mr-2" /> Services Availed
              </h2>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Render Services Content */}
                  <div>
                    {renderTechnoTransferServices(feedback.technoTransfer)}
                  </div>
                  <div>
                    {renderTechnoConsultancyServices(feedback.technoConsultancy)}
                  </div>
                </div>
                {renderAdditionalServices(feedback)}
              </div>
            </div>
            
            {/* Satisfaction Ratings */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiBarChart2 className="mr-2" /> Satisfaction Ratings
              </h2>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-sm font-medium text-gray-500 pb-3">Category</th>
                        <th className="text-center text-sm font-medium text-gray-500 pb-3">1</th>
                        <th className="text-center text-sm font-medium text-gray-500 pb-3">2</th>
                        <th className="text-center text-sm font-medium text-gray-500 pb-3">3</th>
                        <th className="text-center text-sm font-medium text-gray-500 pb-3">4</th>
                        <th className="text-center text-sm font-medium text-gray-500 pb-3">5</th>
                      </tr>
                    </thead>
                    {renderSatisfactionRatings()}
                  </table>
                </div>
                
                {/* Recommendation Score */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-800 mb-3">Recommendation Score</h3>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <div 
                        key={score}
                        className={`flex-1 h-9 flex items-center justify-center rounded-md
                          ${feedback.customerFeedback?.recommendationScore === score 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-500'}`}
                      >
                        {score}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Not likely to recommend</span>
                    <span>Extremely likely</span>
                  </div>
                </div>
                
                {/* Suggestions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-800 mb-3">Suggestions & Comments</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px]">
                    {feedback.customerFeedback?.suggestions || 'No suggestions provided.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackOverview;