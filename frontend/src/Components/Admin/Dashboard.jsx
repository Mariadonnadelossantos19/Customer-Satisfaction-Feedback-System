import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiX,
  FiUsers,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiCpu,
  FiDatabase,
  FiPieChart,
  FiMaximize2,
  FiPrinter,
  FiEye,
} from "react-icons/fi";
import DetailsModal from "./DetailsModal";

const Admin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [selectedService, setSelectedService] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [feedback, setFeedback] = useState({ customerFeedback: {} });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = feedbacks.length; // Set to the total number of feedbacks
  const [sortCriteria, setSortCriteria] = useState("date"); // Default sort by date
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const staffVisitsResponse = await axios.get(
        "http://localhost:5000/api/staff-visits/"
      );

      if (staffVisitsResponse.data && Array.isArray(staffVisitsResponse.data)) {
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
                return {
                  ...staffVisit,
                  customerFeedback: matchingFeedback,
                };
              }

              return staffVisit;
            } catch (error) {
              console.error(
                `Error processing staff visit ${staffVisit._id}:`,
                error
              );
              return staffVisit;
            }
          })
        );

        // Filter out staff visits without feedback
        const validFeedbacks = staffVisitsWithFeedback.filter(
          (visit) => visit.customerFeedback
        );

        setFeedbacks(validFeedbacks);
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

  // Calculate total customers based on feedback responses
  const customerCount = feedbacks.length; // Total responses will equal total customers

  // Calculate total satisfaction
  const totalSatisfaction = feedbacks.reduce((acc, feedback) => {
    const ratings = feedback.customerFeedback?.satisfaction;
    return (
      acc +
      (ratings
        ? Object.values(ratings).reduce((sum, rating) => sum + (rating || 0), 0)
        : 0)
    );
  }, 0);

  const totalRatingsCount = feedbacks.reduce((acc, feedback) => {
    const ratings = feedback.customerFeedback?.satisfaction;
    return (
      acc +
      (ratings
        ? Object.values(ratings).filter((rating) => rating !== null).length
        : 0)
    );
  }, 0);

  const averageSatisfaction =
    totalRatingsCount > 0
      ? (totalSatisfaction / totalRatingsCount).toFixed(2)
      : "N/A";

  // Calculate recommendation score
  const recommendationScoreAvg =
    feedbacks.reduce((acc, feedback) => {
      return acc + (feedback.customerFeedback?.recommendationScore || 0);
    }, 0) / (feedbacks.length || 1);

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

  // Filter feedbacks based on search term
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const name = feedback.customerProfile?.name?.toLowerCase() || "";
    const organization =
      feedback.customerProfile?.organizationName?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      organization.includes(searchTerm.toLowerCase())
    );
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

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
      } else if (sortCriteria === "satisfaction") {
        const satisfactionA =
          a.customerFeedback?.satisfaction?.overallPerception || 0;
        const satisfactionB =
          b.customerFeedback?.satisfaction?.overallPerception || 0;
        comparison = satisfactionA - satisfactionB;
      }

      // Reverse comparison for descending order
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const currentFeedbacks = sortFeedbacks(feedbacks); // Call the sorting function

  const downloadCSV = () => {
    const headers = ["Date", "Name", "Organization", "Satisfaction Score"];
    const csvData = currentFeedbacks.map((feedback) => [
      new Date(feedback.dateOfVisit).toLocaleDateString(),
      feedback.customerProfile?.name || "N/A",
      feedback.customerProfile?.organizationName || "N/A",
      feedback.customerFeedback?.satisfaction?.overallPerception || "N/A",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-data-${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const getServicesString = (feedback) => {
    const services = [];
    if (feedback.tna) services.push("TNA");
    if (feedback.technoTransfer?.enabled) services.push("Technology Transfer");
    if (feedback.technoConsultancy?.enabled)
      services.push("Technical Consultancy");
    return services.join(", ");
  };

  const handleRatingChange = (customerId, ratingType, newRating) => {
    // Update the specific customer's rating based on their ID
    // This should update the state in a way that only affects the targeted customer
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

  // New summary calculations
  const totalFeedbacks = feedbacks.length;

  const handleSortChange = (criteria) => {
    if (sortCriteria === criteria) {
      // Toggle sort order if the same criteria is selected
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc"); // Reset to ascending order when changing criteria
    }
  };

  return (
    <div className="flex-1 flex flex-col">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-1">
                  Average Satisfaction
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {averageSatisfaction}
                  <span className="text-sm font-normal text-gray-500">/6</span>
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <FiActivity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-1 bg-blue-500"
                style={{
                  width: `${Math.min(
                    (parseFloat(averageSatisfaction) / 6) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-1">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {customerCount}
                </p>
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
                <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-1">
                  Recommendation Score
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {recommendationScoreAvg.toFixed(1)}
                  <span className="text-sm font-normal text-gray-500">/10</span>
                </p>
              </div>
              <div className="bg-teal-50 p-3 rounded-full">
                <FiBarChart2 className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-1 bg-teal-500"
                style={{
                  width: `${Math.min(
                    (recommendationScoreAvg / 10) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
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
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="pl-10 pr-8 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none"
              >
                <option value="">All Years</option>
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 8l4 4 4-4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-800">
              Feedback Records
            </h2>
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
                  <th
                    scope="col"
                    className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      onClick={() => handleSortChange("organization")}
                      className="flex items-center"
                    >
                      Organization
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Services
                  </th>
                  <th
                    scope="col"
                    className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      onClick={() => handleSortChange("satisfaction")}
                      className="flex items-center"
                    >
                      Satisfaction
                      {sortCriteria === "satisfaction" &&
                        (sortOrder === "asc" ? " 🔼" : " 🔽")}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 md:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="spinner h-8 w-8 rounded-full border-b-2 border-t-2 border-blue-600 animate-spin mb-4"></div>
                        <p className="text-gray-500">
                          Loading feedback data...
                        </p>
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
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {feedback.dateOfVisit
                            ? new Date(
                                feedback.dateOfVisit
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-800">
                            {feedback.customerProfile?.name || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {feedback.customerProfile?.organizationName ||
                              "N/A"}
                          </div>
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
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          {satisfactionAvg !== "N/A" ? (
                            <div className="flex items-center">
                              <div className="relative w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="absolute top-0 h-2 rounded-full"
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

      {showDetailsModal && (
        <DetailsModal
          feedback={selectedFeedback}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default Admin;
