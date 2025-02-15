import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiDownload, FiCalendar, FiX } from 'react-icons/fi';
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

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // Get all staff visits with populated references
      const response = await axios.get('http://localhost:5000/api/staff-visits/');
      
      if (response.data && Array.isArray(response.data)) {
        setFeedbacks(response.data);
        console.log('Fetched data:', response.data);
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
                    Satisfaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
                        {feedback.customerFeedback?.satisfaction ? 
                          calculateAverageSatisfaction(feedback.customerFeedback.satisfaction)
                          : 'N/A'
                        }
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

  // Helper function to render checkboxes
  const renderCheckbox = (isChecked, label) => (
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 border rounded ${isChecked ? 'bg-blue-500' : 'bg-white'}`} />
      <span className="text-sm">{label}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">CUSTOMER SATISFACTION FEEDBACK FORM</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">DEPARTMENT OF SCIENCE AND TECHNOLOGY</p>
                <p className="text-sm text-gray-600">MIMAROPA REGION</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">TO F1</p>
                <p className="text-sm text-gray-600">Rev 1/04-25-16</p>
              </div>
            </div>

            {/* Visit Details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Date of visit/encounter:</p>
                <p className="font-medium">{new Date(feedback.dateOfVisit).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Attending Staff:</p>
                <p className="font-medium">{feedback.attendingStaff}</p>
              </div>
            </div>

            {/* Services Section */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Services Inquired on/availed:</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Technology Transfer */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Technology Transfer & Commercialization (SETUP/GIA)</h4>
                  <div className="space-y-2">
                    {renderCheckbox(feedback.technoTransfer?.foodProcessing, 'Food Processing')}
                    {renderCheckbox(feedback.technoTransfer?.metalsAndEngineering, 'Metals and Engineering')}
                    {renderCheckbox(feedback.technoTransfer?.giftsHousewareDecors, 'Gifts Houseware Decors')}
                    {renderCheckbox(feedback.technoTransfer?.healthAndPharma, 'Health and Pharma')}
                    {renderCheckbox(feedback.technoTransfer?.agriHoriculture, 'Agri Horiculture')}
                    {renderCheckbox(feedback.technoTransfer?.ict, 'ICT')}
                    {renderCheckbox(feedback.technoTransfer?.aquacultureMarine, 'Aquaculture Marine')}
                    {renderCheckbox(feedback.technoTransfer?.furniture, 'Furniture')}
                  </div>
                </div>

                {/* Technical Consultancy */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Technical Consultancy</h4>
                  <div className="space-y-2">
                    {renderCheckbox(feedback.technoConsultancy?.mpex, 'MPEX')}
                    {renderCheckbox(feedback.technoConsultancy?.cape, 'CAPE')}
                    {renderCheckbox(feedback.technoConsultancy?.cpe, 'CPE')}
                    {renderCheckbox(feedback.technoConsultancy?.energyAudit, 'Energy Audit')}
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Additional Services</h4>
                <div className="space-y-2">
                  {renderCheckbox(feedback.additionalServices?.projectProposal, 'Project Proposal Preparation')}
                  {renderCheckbox(feedback.additionalServices?.packaging, 'Packaging and Labeling')}
                  {renderCheckbox(feedback.additionalServices?.techTraining, 'Technology Training')}
                  {renderCheckbox(feedback.additionalServices?.scholarship, 'Scholarship')}
                  {renderCheckbox(feedback.additionalServices?.libraryServices, 'Library Services')}
                  {renderCheckbox(feedback.additionalServices?.laboratoryServices, 'Laboratory Services')}
                </div>
              </div>
            </section>

            {/* Customer Profile */}
            <section>
              <h3 className="text-lg font-semibold mb-2">SECTION 1: CUSTOMER'S PROFILE</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Full Name:</p>
                    <p className="font-medium">{feedback.customerProfile?.name || 'N/A'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Organization:</p>
                    <p className="font-medium">{feedback.customerProfile?.organizationName || 'N/A'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Address:</p>
                    <p className="font-medium">{feedback.customerProfile?.address || 'N/A'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="font-medium">{feedback.customerProfile?.contact || 'N/A'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Classification:</p>
                    <p className="font-medium">{feedback.customerProfile?.classification || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">First Visit:</p>
                    <p className="font-medium">{feedback.customerProfile?.isFirstVisit ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Sex:</p>
                    <p className="font-medium">{feedback.customerProfile?.sex || 'N/A'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">PWD:</p>
                    <p className="font-medium">{feedback.customerProfile?.isPWD ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Age Group:</p>
                    <p className="font-medium">{feedback.customerProfile?.ageGroup || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Satisfaction Ratings */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Satisfaction Ratings</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {feedback.customerFeedback?.satisfaction && 
                  Object.entries(feedback.customerFeedback.satisfaction).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{value}/5</span>
                    </div>
                  ))
                }
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Recommendation Score:</p>
                  <p className="font-medium">{feedback.customerFeedback?.recommendationScore || 'N/A'}/10</p>
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
                      <th className="text-center text-sm text-gray-600 pb-2">Very Satisfied</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Satisfied</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Neutral</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Dissatisfied</th>
                      <th className="text-center text-sm text-gray-600 pb-2">Very Dissatisfied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Speed And Timeliness',
                      'Quality Of Service',
                      'Relevance Of Service',
                      'Staff Competence',
                      'Staff Attitude',
                      'Overall Perception'
                    ].map((driver) => (
                      <tr key={driver} className="border-b">
                        <td className="py-2 text-sm">{driver}</td>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <td key={rating} className="text-center">
                            <div className="flex justify-center">
                              <div 
                                className={`w-4 h-4 border rounded 
                                  ${feedback.customerFeedback?.satisfaction?.[driver.replace(/\s+/g, '')] === rating 
                                    ? 'bg-blue-500' 
                                    : 'bg-white'}`
                              }
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Recommendation Score */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">How likely is it that you would recommend/endorse DOST's services to others?</p>
                  <div className="flex space-x-2 items-center">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <div 
                        key={score}
                        className={`w-8 h-8 flex items-center justify-center border rounded
                          ${feedback.customerFeedback?.recommendationScore === score 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white'}`
                      }
                      >
                        {score}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
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
        </div>
      </div>
    </div>
  );
};

export default Admin;
