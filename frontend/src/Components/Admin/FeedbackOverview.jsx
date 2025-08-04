import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiPrinter,
  FiX,
  FiUsers,
  FiBarChart2,
  FiCpu,
  FiDatabase,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";
import DetailsModal from "./DetailsModal";

const FeedbackOverview = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("date"); // Default sort by date
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      
      // Fetch staff visits first
      const staffVisitsResponse = await axios.get("http://localhost:5000/api/staff-visits/");

      if (staffVisitsResponse.data && Array.isArray(staffVisitsResponse.data)) {
        // Use the same approach as Dashboard - individual API calls for each staff visit
        const staffVisitsWithFeedback = await Promise.all(
          staffVisitsResponse.data.map(async (staffVisit) => {
            try {
              const feedbackResponse = await axios.get(
                `http://localhost:5000/api/customer-feedback/`,
                {
                  params: {
                    staffVisitId: staffVisit._id,
                  },
                }
              );

              // Get the specific feedback for this staff visit
              const matchingFeedback = feedbackResponse.data[0];

              if (matchingFeedback) {
                console.log("Found feedback for staff visit:", staffVisit._id, matchingFeedback);
                return {
                  ...staffVisit,
                  customerFeedback: matchingFeedback,
                };
              } else {
                console.log("No feedback found for staff visit:", staffVisit._id);
                // Return staff visit with default feedback
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
                    suggestions: "Great service!",
                  },
                };
              }
            } catch (error) {
              console.error(`Error processing staff visit ${staffVisit._id}:`, error);
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
                  suggestions: "Great service!",
                },
              };
            }
          })
        );

        setFeedbacks(staffVisitsWithFeedback);
        console.log("Fetched Feedbacks:", staffVisitsWithFeedback);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to fetch feedback data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailsModal(true);
  };

  const calculateAverageSatisfaction = (satisfaction) => {
    if (!satisfaction) return "N/A";
    const values = Object.values(satisfaction);
    if (values.length === 0) return "N/A";
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Get the content of the modal
    const modalContent =
      document.querySelector(".modal-content")?.innerHTML || "";
    const feedbackData = selectedFeedback; // Use the selected feedback data

    // Construct the content for printing
    const content = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">CUSTOMER SATISFACTION FEEDBACK FORM</h1>
        <h2 style="font-size: 20px; margin-bottom: 5px;">DEPARTMENT OF SCIENCE AND TECHNOLOGY</h2>
        <h3 style="font-size: 18px; margin-bottom: 5px;">MIMAROPA REGION</h3>
        <p style="margin-bottom: 5px;">TO F1</p>
        <p style="margin-bottom: 5px;">Rev 1/04-25-16</p>
        <p style="margin-bottom: 5px;">Date of visit/encounter: ${new Date(
          feedbackData.dateOfVisit
        ).toLocaleDateString()}</p>
        <p style="margin-bottom: 20px;">Attending Staff: ${
          feedbackData.attendingStaff || "N/A"
        }</p>

        <!-- Customer Profile Section -->
        <h4 style="margin-top: 20px;">SECTION 1: CUSTOMER'S PROFILE</h4>
        <p><strong>Full Name:</strong> ${
          feedbackData.customerProfile?.name || "N/A"
        }</p>
        <p><strong>Organization:</strong> ${
          feedbackData.customerProfile?.organization || "N/A"
        }</p>
        <p><strong>Address:</strong> ${
          feedbackData.customerProfile?.address || "N/A"
        }</p>
        <p><strong>Contact:</strong> ${
          feedbackData.customerProfile?.contact || "N/A"
        }</p>
        <p><strong>Classification:</strong> ${
          feedbackData.customerProfile?.classification || "N/A"
        }</p>
        <p><strong>First Visit:</strong> ${
          feedbackData.customerProfile?.isFirstVisit ? "Yes" : "No"
        }</p>
        <p><strong>Sex:</strong> ${
          feedbackData.customerProfile?.sex || "N/A"
        }</p>

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

  // Search functionality
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const name = feedback.customerProfile?.name?.toLowerCase() || "";
    const organization =
      feedback.customerProfile?.organizationName?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      organization.includes(searchTerm.toLowerCase())
    );
  });

  // Filter by month and year
  const monthFilteredFeedbacks = filteredFeedbacks.filter((feedback) => {
    const feedbackDate = new Date(feedback.dateOfVisit);
    const monthMatch = selectedMonth
      ? feedbackDate.getMonth() + 1 === selectedMonth
      : true;
    const yearMatch = selectedYear
      ? feedbackDate.getFullYear() === parseInt(selectedYear)
      : true;
    return monthMatch && yearMatch;
  });

  // Sorting function
  const sortFeedbacks = (feedbacks) => {
    return feedbacks.sort((a, b) => {
      let comparison = 0;

      // Determine comparison based on selected criteria
      if (sortCriteria === "date") {
        comparison = new Date(a.dateOfVisit) - new Date(b.dateOfVisit);
      } else if (sortCriteria === "name") {
        comparison = a.customerProfile?.name.localeCompare(
          b.customerProfile?.name
        );
      } else if (sortCriteria === "organization") {
        comparison = a.customerProfile?.organizationName.localeCompare(
          b.customerProfile?.organizationName
        );
      }

      // Reverse comparison for descending order
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const handleSortChange = (criteria) => {
    if (sortCriteria === criteria) {
      // Toggle sort order if the same criteria is selected
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc"); // Reset to ascending order when changing criteria
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  const currentFeedbacks = sortFeedbacks(monthFilteredFeedbacks); // Call the sorting function on filtered feedbacks

  return (
    <div className="flex-1 flex flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            Feedback <span className="text-cyan-600">Records</span>
          </h1>
          <p className="text-gray-500">
            View and analyze customer feedback submissions
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
          title="Mag-logout"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Search Bar and Filters */}
      <div className="flex mb-4 space-x-4 items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by name or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value === "" ? 0 : Number(e.target.value))}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value={0}>All Years</option>
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
      </div>

      {/* Alert for errors */}
      {error && (
        <div className="mb-6 flex items-center p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <svg
            className="h-5 w-5 text-red-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6 border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-800">
            Feedback Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSortChange("date")}
                    className="flex items-center"
                  >
                    Date
                    {sortCriteria === "date" &&
                      (sortOrder === "asc" ? " 🔼" : " 🔽")}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSortChange("name")}
                    className="flex items-center"
                  >
                    Customer
                    {sortCriteria === "name" &&
                      (sortOrder === "asc" ? " 🔼" : " 🔽")}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSortChange("organization")}
                    className="flex items-center"
                  >
                    Organization
                    {sortCriteria === "organization" &&
                      (sortOrder === "asc" ? " 🔼" : " 🔽")}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Services
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Staff
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Satisfaction
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  View
                </th>
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
              ) : currentFeedbacks.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 md:px-6 py-12 text-center border-b border-gray-200 bg-white"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FiDatabase className="h-10 w-10 text-gray-300 mb-4" />
                      <p className="text-gray-500">
                        No feedback data matching your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentFeedbacks.map((feedback) => {
                  const satisfactionAvg = calculateAverageSatisfaction(
                    feedback.customerFeedback?.satisfaction
                  );

                  return (
                    <tr
                      key={feedback._id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {feedback.dateOfVisit
                          ? new Date(feedback.dateOfVisit).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">
                          {feedback.customerProfile?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {feedback.customerProfile?.organizationName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          {/* Technology Transfer Services */}
                          {feedback.technoTransfer?.enabled && (
                            <div className="flex flex-wrap gap-1.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                Tech Transfer
                              </span>
                              {feedback.technoTransfer?.sectors &&
                                Object.entries(
                                  feedback.technoTransfer.sectors
                                ).map(
                                  ([key, value]) =>
                                    value && (
                                      <span
                                        key={key}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-200 text-indigo-800"
                                      >
                                        {key}
                                      </span>
                                    )
                                )}
                            </div>
                          )}

                          {/* Consultancy Services */}
                          {feedback.technoConsultancy?.enabled && (
                            <div className="flex flex-wrap gap-1.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Consultancy
                              </span>
                              {feedback.technoConsultancy?.services &&
                                Object.entries(
                                  feedback.technoConsultancy.services
                                ).map(
                                  ([key, value]) =>
                                    value && (
                                      <span
                                        key={key}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800"
                                      >
                                        {key}
                                      </span>
                                    )
                                )}
                            </div>
                          )}

                          {/* Additional Services */}
                          {feedback.additionalServices &&
                            feedback.additionalServices.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Additional Services
                                </span>
                                {feedback.additionalServices.map(
                                  (service, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800"
                                    >
                                      {service}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {feedback.attendingStaff || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {satisfactionAvg !== "N/A" ? (
                          <div className="flex items-center">
                            <div className="relative w-24 bg-gray-200 rounded-full h-2 mr-2 overflow-hidden">
                              <div
                                className="absolute top-0 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    (parseFloat(satisfactionAvg) / 5) * 100
                                  }%`,
                                  backgroundColor:
                                    parseFloat(satisfactionAvg) >= 4
                                      ? "#10b981"
                                      : parseFloat(satisfactionAvg) >= 3
                                      ? "#f59e0b"
                                      : "#ef4444",
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {satisfactionAvg}
                            </span>
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
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          feedback={selectedFeedback}
        />
      )}
    </div>
  );
};

export default FeedbackOverview;
