import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiDownload, FiCalendar, FiX, FiUsers, FiStar } from 'react-icons/fi';
import Navbar from "../Components/Layout/Navbar";

const Admin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [feedback, setFeedback] = useState({ customerFeedback: {} });

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
              // Fetch feedback for the specific staff visit and customer profile
              const feedbackResponse = await axios.get(`http://localhost:5000/api/customer-feedback/`, {
                params: {
                  staffVisitId: staffVisit._id, // Assuming the API can filter by staff visit ID
                  customerProfileId: staffVisit.customerProfileId // Assuming the API can filter by customer profile ID
                }
              });

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
                customerFeedback // Set fetched or default feedback
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
        console.log('Fetched and transformed data:', staffVisitsWithFeedback);
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

  // Calculate unique customers
  const uniqueCustomers = new Set(feedbacks.map(feedback => feedback.customerProfile?.name));
  const customerCount = uniqueCustomers.size;

  // Calculate total ratings
  const totalRatings = feedbacks.reduce((acc, feedback) => {
    const ratings = feedback.customerFeedback?.satisfaction;
    return acc + (ratings ? Object.values(ratings).filter(rating => rating !== null).length : 0);
  }, 0);

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

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.customerProfile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.customerProfile?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      new Date(feedback.dateOfVisit).toLocaleDateString().includes(dateFilter);
    
    const matchesService = !selectedService || 
      (feedback[selectedService]?.enabled || feedback[selectedService]);

    return matchesSearch && matchesDate && matchesService;
  });

  const downloadCSV = () => {
    const headers = ['Date', 'Name', 'Organization', 'Services', 'Satisfaction Score'];
    const csvData = filteredFeedbacks.map(feedback => [
      new Date(feedback.dateOfVisit).toLocaleDateString(),
      feedback.customerProfile?.name || 'N/A',
      feedback.customerProfile?.organizationName || 'N/A',
      getServicesString(feedback),
      calculateAverageSatisfaction(feedback.customerFeedback?.satisfaction)
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-data-${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const getServicesString = (feedback) => {
    const services = [];
    if (feedback.tna) services.push('TNA');
    if (feedback.technoTransfer?.enabled) services.push('Technology Transfer');
    if (feedback.technoConsultancy?.enabled) services.push('Technical Consultancy');
    return services.join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Customer Feedback Dashboard</h1>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Display Total Ratings with Icon */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-600 flex items-center rectangle">
            <FiStar className="w-6 h-6 mr-2" /> {/* Star Icon */}
            <span className="font-medium">Total Ratings: {totalRatings}</span>
          </div>

          {/* Display Customer Count with Icon */}
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 flex items-center rectangle">
            <FiUsers className="w-6 h-6 mr-2" /> {/* User Icon */}
            <span className="font-medium">Total Customers: {customerCount}</span>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Services</option>
                <option value="technoTransfer">Technology Transfer</option>
                <option value="technoConsultancy">Technical Consultancy</option>
                <option value="tna">TNA</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No feedback data available
                    </td>
                  </tr>
                ) : (
                  filteredFeedbacks.map((feedback) => (
                    <tr key={feedback._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {feedback.dateOfVisit ? new Date(feedback.dateOfVisit).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {feedback.customerProfile?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {feedback.customerProfile?.organizationName || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {feedback.tna && (
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              TNA
                            </span>
                          )}
                          {feedback.technoTransfer?.enabled && (
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Tech Transfer
                            </span>
                          )}
                          {feedback.technoConsultancy?.enabled && (
                            <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                              Tech Consultancy
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(feedback)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDetailsModal && (
        <DetailsModal
          feedback={selectedFeedback}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

const DetailsModal = ({ feedback, onClose }) => {
  if (!feedback) return null;

  console.log('Feedback Data:', feedback); // Debugging line

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
        <h3 className="font-semibold">Technology Transfer & Commercialization (SETUP/GIA)</h3>
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
        <h3 className="font-semibold">Technical Consultancy</h3>
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
        <h2 className="text-lg font-semibold mb-4">Additional Services</h2>
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

  // Satisfaction ratings section
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="bg-gray-100 p-4 border-b">
            <h1 className="text-2xl font-bold text-center">CUSTOMER SATISFACTION FEEDBACK FORM</h1>
            <div className="flex justify-between mt-4">
              <div className="flex-1">
                <p className="font-semibold">DEPARTMENT OF SCIENCE AND TECHNOLOGY</p>
                <p>MIMAROPA REGION</p>
              </div>
              <div className="text-right">
                <p>TO F1</p>
                <p>Rev 1/04-25-16</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex-1">
                <p><strong>Date of visit/encounter:</strong> {new Date(feedback.dateOfVisit).toLocaleDateString()}</p>
              </div>
              <div className="flex-1 text-right">
                <p><strong>Attending Staff:</strong> {feedback.attendingStaff || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Services Section */}
            <section>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {renderTechnoTransferServices(feedback.technoTransfer)}
                </div>
                <div>
                  {renderTechnoConsultancyServices(feedback.technoConsultancy)}
                </div>
              </div>
              {renderAdditionalServices(feedback)}
              <p className="text-sm text-gray-600">How did you know of our services? (i.e. friend referral,
                TV, radio, newspaper, internet, fairs/forums, etc.):</p>
                      <p className="font-medium">{feedback.referralSource || 'N/A'}</p>
            </section>

            {/* Customer Profile */}
            <section>
              <h3 className="text-lg font-semibold mb-2">SECTION 1: CUSTOMER'S PROFILE</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name:</p>
                      <p className="font-medium">{feedback.customerProfile?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Organization:</p>
                      <p className="font-medium">{feedback.customerProfile?.organizationName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address:</p>
                      <p className="font-medium">{feedback.customerProfile?.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact:</p>
                      <p className="font-medium">{feedback.customerProfile?.contact || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Classification:</p>
                      <div className="space-y-1">
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
                            <span className="mr-2">[{feedback.customerProfile?.classification === item ? '✓' : ' '}]</span>
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 mr-4">First Visit:</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="mr-1">[{feedback.customerProfile?.isFirstVisit ? '✓' : ' '}]</span>
                          <span className="text-sm">Yes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">[{!feedback.customerProfile?.isFirstVisit ? '✓' : ' '}]</span>
                          <span className="text-sm">No</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Sex:</p>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <span className="mr-1">[{feedback.customerProfile?.sex === 'Male' ? '✓' : ' '}]</span>
                          <span className="text-sm">Male</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">[{feedback.customerProfile?.sex === 'Female' ? '✓' : ' '}]</span>
                          <span className="text-sm">Female</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">PWD:</p>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <span className="mr-1">[{feedback.customerProfile?.isPWD ? '✓' : ' '}]</span>
                          <span className="text-sm">Yes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">[{!feedback.customerProfile?.isPWD ? '✓' : ' '}]</span>
                          <span className="text-sm">No</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Age Group:</p>
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
                            <span className="mr-1">[{feedback.customerProfile?.ageGroup === age ? '✓' : ' '}]</span>
                            <span className="text-sm">{age}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Level of Education:</p>
                      <div className="space-y-1">
                        {[
                          'Elementary',
                          'High School',
                          'College',
                          'Masters/PhD',
                          'Others'
                        ].map((level) => (
                          <div key={level} className="flex items-center">
                            <span className="mr-1">[{feedback.customerProfile?.educationLevel === level ? '✓' : ' '}]</span>
                            <span className="text-sm">{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Satisfaction Ratings */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Satisfaction Ratings</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {feedback.customerFeedback?.satisfaction && renderSatisfactionRatings()}
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Recommendation Score:</p>
                  <p className="font-medium">{feedback.customerFeedback?.recommendationScore || 'N/A'}/10</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Suggestions:</p>
                  <p className="text-sm bg-white p-2 rounded border">
                    {feedback.customerFeedback?.suggestions || 'No suggestions provided'}
                  </p>
                </div>
              </div>
            </section>

            {/* Satisfaction Ratings - Section 2 */}
            <section>
              <h3 className="text-lg font-semibold mb-2">SECTION 2: CUSTOMER EVALUATION/FEEDBACK</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <table className="w-full mb-6">
                  <thead>
                    <tr>
                      <th className="text-left text-sm text-gray-600 pb-2 w-1/3">Drivers of Satisfaction</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Very Satisfied (1)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Satisfied (2)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Neutral (3)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Dissatisfied (4)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Very Dissatisfied (5)</th>
                    </tr>
                  </thead>
                  {renderSatisfactionRatings()}
                </table>

                {/* Recommendation Score */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">How likely is it that you would recommend/endorse DOST's services to others?</p>
                  <div className="flex space-x-2 items-center mb-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <div 
                        key={score}
                        className={`w-8 h-8 flex items-center justify-center border rounded-lg
                          ${feedback.customerFeedback?.recommendationScore === score 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'border-gray-300'}`}
                      >
                        {score}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Not at all likely</span>
                    <span>Extremely likely</span>
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                  <p className="text-sm bg-white p-2 rounded border">
                    {feedback.customerFeedback?.suggestions || 'No suggestions provided'}
                  </p>
                </div>
              </div>
            </section>

            {/* Library Users Section - Section 3 */}
            <section>
              <h3 className="text-lg font-semibold mb-2">SECTION 3: FOR LIBRARY USERS ONLY</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Queries Answered:</p>
                  <p className="font-medium">{feedback.libraryFeedback?.queriesAnswered ? 'Yes' : 'No'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Please specify subject of interest:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'agriHorticulture',
                      'aquacultureMarine',
                      'furniture',
                      'foodProcessing',
                      'giftsHousewareDecors',
                      'healthAndPharma',
                      'ict',
                      'metalsAndEngineering',
                      'others'
                    ].map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <div 
                          className={`w-4 h-4 border rounded 
                            ${feedback.libraryFeedback?.subjectsOfInterest?.[subject] 
                              ? 'bg-blue-500' 
                              : 'bg-white'}`
                        }
                        />
                        <span className="text-sm">
                          {subject.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
