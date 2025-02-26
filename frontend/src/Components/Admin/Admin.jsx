import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiSearch, FiFilter, FiDownload, FiCalendar, FiX, FiUsers, 
  FiBarChart2, FiChevronLeft, FiChevronRight, FiActivity,
  FiCpu, FiDatabase, FiPieChart, FiMaximize2, FiPrinter, FiEye
} from 'react-icons/fi';
import Sidebar from './Sidebar';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = feedbacks.length; // Set to the total number of feedbacks

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
              console.log('Feedback Response:', feedbackResponse.data); // Log the response

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
        console.log('Fetched Feedbacks:', staffVisitsWithFeedback); // Log the fetched feedbacks
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

  // Calculate metrics
  const uniqueCustomers = new Set(feedbacks.map(feedback => feedback.customerProfile?.name));
  const customerCount = uniqueCustomers.size;

  const totalSatisfaction = feedbacks.reduce((acc, feedback) => {
    const ratings = feedback.customerFeedback?.satisfaction;
    return acc + (ratings ? Object.values(ratings).reduce((sum, rating) => sum + (rating || 0), 0) : 0);
  }, 0);
  
  const totalRatingsCount = feedbacks.reduce((acc, feedback) => {
    const ratings = feedback.customerFeedback?.satisfaction;
    return acc + (ratings ? Object.values(ratings).filter(rating => rating !== null).length : 0);
  }, 0);
  
  const averageSatisfaction = totalRatingsCount > 0 ? (totalSatisfaction / totalRatingsCount).toFixed(2) : 'N/A';

  const recommendationScoreAvg = feedbacks.reduce((acc, feedback) => {
    return acc + (feedback.customerFeedback?.recommendationScore || 0);
  }, 0) / (feedbacks.length || 1);

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

  // Filter feedbacks based on search term
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const name = feedback.customerProfile?.name?.toLowerCase() || '';
    const organization = feedback.customerProfile?.organizationName?.toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase()) || organization.includes(searchTerm.toLowerCase());
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  // Get current feedbacks for the page
  const currentFeedbacks = filteredFeedbacks; // Show filtered feedbacks

  const downloadCSV = () => {
    const headers = ['Date', 'Name', 'Organization', 'Satisfaction Score'];
    const csvData = currentFeedbacks.map(feedback => [
      new Date(feedback.dateOfVisit).toLocaleDateString(),
      feedback.customerProfile?.name || 'N/A',
      feedback.customerProfile?.organizationName || 'N/A',
      feedback.customerFeedback?.satisfaction?.overallPerception || 'N/A'
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

  const handleRatingChange = (customerId, ratingType, newRating) => {
    // Update the specific customer's rating based on their ID
    // This should update the state in a way that only affects the targeted customer
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

  // New summary calculations
  const totalFeedbacks = feedbacks.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-mono tracking-tight text-gray-800 mb-2">
              Customer Feedback <span className="text-blue-600">Analytics</span>
            </h1>
            <p className="text-gray-500 font-light">
              Analyze and visualize customer satisfaction data across departments
            </p>
          </div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-1">Average Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-800">{averageSatisfaction}<span className="text-sm font-normal text-gray-500">/5</span></p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <FiActivity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-1 bg-blue-500" 
                  style={{ width: `${Math.min((parseFloat(averageSatisfaction) / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-1">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-800">{customerCount}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-full">
                  <FiUsers className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {feedbacks.length} total interactions
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-teal-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-1">Recommendation Score</p>
                  <p className="text-2xl font-bold text-gray-800">{recommendationScoreAvg.toFixed(1)}<span className="text-sm font-normal text-gray-500">/10</span></p>
                </div>
                <div className="bg-teal-50 p-3 rounded-full">
                  <FiBarChart2 className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-1 bg-teal-500" 
                  style={{ width: `${Math.min((recommendationScoreAvg / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-1">Data points</p>
                  <p className="text-2xl font-bold text-gray-800">{totalRatingsCount}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <FiDatabase className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Across {Object.keys(feedbacks[0]?.customerFeedback?.satisfaction || {}).length || 0} metrics
              </p>
            </div>
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
          
          {/* Filters */}
          <div className="bg-white shadow-sm rounded-lg p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="pl-10 pr-8 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none"
                >
                  <option value="">All Services</option>
                  <option value="technoTransfer">Technology Transfer</option>
                  <option value="technoConsultancy">Technical Consultancy</option>
                  <option value="tna">TNA</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">Feedback Records</h2>
              <button 
                onClick={downloadCSV} 
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                <FiDownload className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 md:px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="spinner h-8 w-8 rounded-full border-b-2 border-t-2 border-blue-600 animate-spin mb-4"></div>
                          <p className="text-gray-500">Loading feedback data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentFeedbacks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 md:px-6 py-12 text-center border-b border-gray-200 bg-white">
                        <div className="flex flex-col items-center justify-center">
                          <FiDatabase className="h-10 w-10 text-gray-300 mb-4" />
                          <p className="text-gray-500">No feedback data matching your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentFeedbacks.map((feedback) => {
                      const satisfactionAvg = calculateAverageSatisfaction(feedback.customerFeedback?.satisfaction);
                      
                      return (
                        <tr key={feedback._id} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {feedback.dateOfVisit ? new Date(feedback.dateOfVisit).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-800">{feedback.customerProfile?.name || 'N/A'}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{feedback.customerProfile?.organizationName || 'N/A'}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {feedback.tna && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  TNA
                                </span>
                              )}
                              {feedback.technoTransfer?.enabled && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                  Tech Transfer
                                </span>
                              )}
                              {feedback.technoConsultancy?.enabled && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Consultancy
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {feedback.attendingStaff || 'N/A'}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            {satisfactionAvg !== 'N/A' ? (
                              <div className="flex items-center">
                                <div className="relative w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="absolute top-0 h-2 rounded-full" 
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
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
                            <button 
                              onClick={() => handleViewDetails(feedback)} 
                              className="text-blue-600 hover:text-blue-800 font-medium p-2 rounded-full hover:bg-blue-50 transition-colors duration-150"
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
        </div>
      </div>

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

const DetailsModal = ({ feedback, onClose, onPrint }) => {
  console.log('Feedback in Modal:', feedback); // Debugging line
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto modal-content">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
            <h1 className="text-2xl font-bold text-center text-gray-800">CUSTOMER SATISFACTION FEEDBACK FORM</h1>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={onPrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center"
              >
                <FiPrinter className="mr-2" /> Print Form
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-150"
              >
                Close
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
            <div className="flex justify-between mt-4">
              <div className="flex-1">
                <p><strong>Date of visit:</strong> {new Date(feedback.dateOfVisit).toLocaleDateString()}</p>
              </div>
              <div className="flex-1 text-right">
                <p><strong>Attending Staff:</strong> {feedback.attendingStaff || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Services Section */}
            <section>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  {renderTechnoTransferServices(feedback.technoTransfer)}
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  {renderTechnoConsultancyServices(feedback.technoConsultancy)}
                </div>
              </div>
              {renderAdditionalServices(feedback)}
              <p className="text-sm text-gray-600">How did you know of our services?</p>
              <p className="font-medium bg-gray-50 p-2 rounded">{feedback.referralSource || 'N/A'}</p>
            </section>

            {/* Customer Profile */}
            <section>
              <h6 className="text-lg font-semibold mb-2 flex items-center">
                <FiUsers className="mr-2 text-blue-600" /> CUSTOMER'S PROFILE
              </h6>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
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
                            <span className="mr-1">[{feedback.customerProfile?.classification === item ? '✓' : ' '}]</span>
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

            {/* Satisfaction Ratings - Section 2 */}
            <section>
              <h6 className="text-lg font-semibold mb-2 flex items-center">
                <FiBarChart2 className="mr-2 text-blue-600" /> CUSTOMER EVALUATION/FEEDBACK
              </h6>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
                <table className="w-full mb-6">
                  <thead>
                    <tr>
                      <th className="text-left text-sm text-gray-600 pb-2 w-1/3">Drivers of Satisfaction</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Very Satisfied (5)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Satisfied (4)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Neutral (3)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Dissatisfied (2)</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Very Dissatisfied (1)</th>
                    </tr>
                  </thead>
                  {renderSatisfactionRatings()}
                </table>

                {/* Recommendation Score */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">How likely is it that you would recommend/endorse DOST's services to others?</p>
                  <div className="flex space-x-1 items-center mb-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <div 
                        key={score}
                        className={`w-8 h-8 flex items-center justify-center border rounded-lg
                          ${feedback.customerFeedback?.recommendationScore === score 
                            ? 'bg-blue-600 text-white border-blue-600' 
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
                  <p className="text-sm bg-white p-3 rounded border">
                    {feedback.customerFeedback?.suggestions || 'No suggestions provided'}
                  </p>
                </div>
              </div>
            </section>

            {/* Library Users Section - Section 3 */}
            <section>
              <h6 className="text-lg font-semibold mb-2 flex items-center">
                <FiDatabase className="mr-2 text-blue-600" /> FOR LIBRARY USERS ONLY
              </h6>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
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
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/80 rounded-full p-1"
            aria-label="Close"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
