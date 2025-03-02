import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiDownload,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiList,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
                  staffVisitId: staffVisit._id
                }
              });
              const matchingFeedback = feedbackResponse.data[0];
              return matchingFeedback ? { ...staffVisit, customerFeedback: matchingFeedback } : staffVisit;
            } catch (error) {
              console.error(`Error processing staff visit ${staffVisit._id}:`, error);
              return staffVisit;
            }
          })
        );
        setFeedbacks(staffVisitsWithFeedback.filter(visit => visit.customerFeedback));
      }
    } catch (error) {
      setError('Failed to fetch feedback data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSatisfactionMetrics = () => {
    const metrics = {
      speedAndTimeliness: 0,
      qualityOfService: 0,
      relevanceOfService: 0,
      staffCompetence: 0,
      staffAttitude: 0,
      overallPerception: 0,
    };

    feedbacks.forEach(feedback => {
      const satisfaction = feedback.customerFeedback?.satisfaction || {};
      Object.keys(metrics).forEach(key => {
        metrics[key] += satisfaction[key] || 0;
      });
    });

    const count = feedbacks.length || 1;
    return Object.keys(metrics).map(key => ({
      name: key.replace(/([A-Z])/g, ' $1').trim(),
      value: (metrics[key] / count).toFixed(2)
    }));
  };

  const calculateServiceDistribution = () => {
    const services = {
      TNA: 0,
      'Technology Transfer': 0,
      'Technical Consultancy': 0
    };

    feedbacks.forEach(feedback => {
      if (feedback.tna) services.TNA++;
      if (feedback.technoTransfer?.enabled) services['Technology Transfer']++;
      if (feedback.technoConsultancy?.enabled) services['Technical Consultancy']++;
    });

    return Object.entries(services).map(([name, value]) => ({ name, value }));
  };

  const generateMonthlyTrends = () => {
    const monthlyData = Array(12).fill(0).map((_, index) => ({
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      satisfaction: 0,
      count: 0
    }));

    feedbacks.forEach(feedback => {
      const date = new Date(feedback.dateOfVisit);
      if (date.getFullYear() === selectedYear) {
        const month = date.getMonth();
        const satisfaction = feedback.customerFeedback?.satisfaction?.overallPerception || 0;
        monthlyData[month].satisfaction += satisfaction;
        monthlyData[month].count++;
      }
    });

    return monthlyData.map(data => ({
      ...data,
      satisfaction: data.count ? (data.satisfaction / data.count).toFixed(2) : 0
    }));
  };

  const calculateCustomerUsage = () => {
    const monthlyUsage = Array(12).fill(0).map((_, index) => ({
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      customers: 0
    }));

    const yearlyUsage = {};

    feedbacks.forEach(feedback => {
      const date = new Date(feedback.dateOfVisit);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (year === selectedYear) {
        monthlyUsage[month].customers++;
      }

      yearlyUsage[year] = (yearlyUsage[year] || 0) + 1;
    });

    return {
      monthly: monthlyUsage,
      yearly: Object.entries(yearlyUsage).map(([year, count]) => ({
        year,
        customers: count
      })).sort((a, b) => a.year - b.year)
    };
  };

  const analyzeServiceUsage = () => {
    const serviceDetails = {
      tna: {
        name: 'Training Needs Assessment',
        count: 0,
        monthlyData: Array(12).fill(0)
      },
      technoTransfer: {
        name: 'Technology Transfer',
        count: 0,
        monthlyData: Array(12).fill(0),
        sectors: {
          foodProcessing: 0,
          metalsAndEngineering: 0,
          giftsHousewaresDecors: 0,
          healthAndPharma: 0,
          agriHorticulture: 0,
          ict: 0,
          aquacultureMarine: 0,
          furniture: 0,
          others: 0
        }
      },
      technoConsultancy: {
        name: 'Technical Consultancy',
        count: 0,
        monthlyData: Array(12).fill(0),
        services: {
          mpex: 0,
          cape: 0,
          cpt: 0,
          energyAudit: 0,
          others: 0
        }
      },
      projectProposalPreparation: {
        name: 'Project Proposal Preparation',
        count: 0,
        monthlyData: Array(12).fill(0)
      },
      packagingAndLabeling: {
        name: 'Packaging and Labeling',
        count: 0,
        monthlyData: Array(12).fill(0)
      },
      technologyTraining: {
        name: 'Technology Training',
        count: 0,
        monthlyData: Array(12).fill(0)
      },
      technologyClinics: {
        name: 'Technology Clinics/Forum',
        count: 0,
        monthlyData: Array(12).fill(0)
      },
      scholarship: {
        name: 'Scholarship',
        count: 0,
        monthlyData: Array(12).fill(0)
      },
      laboratory: {
        name: 'Laboratory (Metrology/Microbiology)',
        count: 0,
        monthlyData: Array(12).fill(0)
      },
      library: {
        name: 'Library Services',
        count: 0,
        monthlyData: Array(12).fill(0)
      }
    };

    feedbacks.forEach(feedback => {
      const date = new Date(feedback.dateOfVisit);
      const month = date.getMonth();
      
      // Count main services
      if (feedback.tna) {
        serviceDetails.tna.count++;
        serviceDetails.tna.monthlyData[month]++;
      }

      // Technology Transfer sectors
      if (feedback.technoTransfer?.enabled) {
        serviceDetails.technoTransfer.count++;
        serviceDetails.technoTransfer.monthlyData[month]++;
        
        Object.entries(feedback.technoTransfer.sectors).forEach(([key, value]) => {
          if (value && serviceDetails.technoTransfer.sectors[key] !== undefined) {
            serviceDetails.technoTransfer.sectors[key]++;
          }
        });
      }

      // Technical Consultancy services
      if (feedback.technoConsultancy?.enabled) {
        serviceDetails.technoConsultancy.count++;
        serviceDetails.technoConsultancy.monthlyData[month]++;
        
        Object.entries(feedback.technoConsultancy.services).forEach(([key, value]) => {
          if (value && serviceDetails.technoConsultancy.services[key] !== undefined) {
            serviceDetails.technoConsultancy.services[key]++;
          }
        });
      }

      // Other services
      if (feedback.projectProposalPreparation) {
        serviceDetails.projectProposalPreparation.count++;
        serviceDetails.projectProposalPreparation.monthlyData[month]++;
      }
      if (feedback.packagingAndLabeling) {
        serviceDetails.packagingAndLabeling.count++;
        serviceDetails.packagingAndLabeling.monthlyData[month]++;
      }
      if (feedback.technologyTraining) {
        serviceDetails.technologyTraining.count++;
        serviceDetails.technologyTraining.monthlyData[month]++;
      }
      if (feedback.technologyClinics?.enabled) {
        serviceDetails.technologyClinics.count++;
        serviceDetails.technologyClinics.monthlyData[month]++;
      }
      if (feedback.scholarship) {
        serviceDetails.scholarship.count++;
        serviceDetails.scholarship.monthlyData[month]++;
      }
      if (feedback.laboratory?.enabled) {
        serviceDetails.laboratory.count++;
        serviceDetails.laboratory.monthlyData[month]++;
      }
      if (feedback.library?.enabled) {
        serviceDetails.library.count++;
        serviceDetails.library.monthlyData[month]++;
      }
    });

    // Calculate total services for percentages
    const totalServices = Object.values(serviceDetails).reduce((sum, service) => sum + service.count, 0);

    // Add percentage to each service
    Object.values(serviceDetails).forEach(service => {
      service.percentage = ((service.count / totalServices) * 100).toFixed(1);
    });

    return {
      details: serviceDetails,
      sectorAnalysis: {
        technoTransfer: Object.entries(serviceDetails.technoTransfer.sectors)
          .map(([key, count]) => ({
            name: key.replace(/([A-Z])/g, ' $1').trim(),
            count,
            percentage: ((count / serviceDetails.technoTransfer.count || 1) * 100).toFixed(1)
          })),
        technoConsultancy: Object.entries(serviceDetails.technoConsultancy.services)
          .map(([key, count]) => ({
            name: key.toUpperCase(),
            count,
            percentage: ((count / serviceDetails.technoConsultancy.count || 1) * 100).toFixed(1)
          }))
      },
      referralSources: calculateReferralSources(feedbacks)
    };
  };

  // Add this new function to analyze referral sources
  const calculateReferralSources = (feedbacks) => {
    const sources = {
      'DOST Website': 0,
      'Social Media': 0,
      'Friends/Relatives': 0,
      'Others': 0
    };

    feedbacks.forEach(feedback => {
      if (feedback.referralSource) {
        sources[feedback.referralSource] = (sources[feedback.referralSource] || 0) + 1;
      }
    });

    const total = Object.values(sources).reduce((sum, count) => sum + count, 0);
    return Object.entries(sources).map(([source, count]) => ({
      name: source,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const downloadReport = () => {
    // Implementation for downloading report as PDF or Excel
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Analytics Reports</h1>
        <button
          onClick={downloadReport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiDownload className="mr-2" /> Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium flex items-center">
              <FiUsers className="mr-2" /> Customer Usage Statistics
            </h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Monthly Customer Count ({selectedYear})</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={calculateCustomerUsage().monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Yearly Customer Count</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={calculateCustomerUsage().yearly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-indigo-600 text-sm font-medium">Total Customers This Month</h4>
                <p className="text-2xl font-bold text-indigo-700">
                  {calculateCustomerUsage().monthly[new Date().getMonth()].customers}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-emerald-600 text-sm font-medium">Total Customers This Year</h4>
                <p className="text-2xl font-bold text-emerald-700">
                  {calculateCustomerUsage().yearly.find(y => y.year === selectedYear.toString())?.customers || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <FiBarChart2 className="mr-2" /> Satisfaction Metrics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateSatisfactionMetrics()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <FiPieChart className="mr-2" /> Service Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={calculateServiceDistribution()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {calculateServiceDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <FiTrendingUp className="mr-2" /> Satisfaction Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateMonthlyTrends()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="satisfaction" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add this new section after existing charts */}
      <div className="mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-6 flex items-center">
            <FiList className="mr-2" /> Service Usage Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {Object.values(analyzeServiceUsage().details).map((service, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">{service.name}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{service.count}</p>
                <p className="text-sm text-gray-500">
                  {service.percentage}% of total services
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Usage Trends */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Monthly Service Usage Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyzeServiceUsage().sectorAnalysis.technoTransfer}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Service Distribution Comparison */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Service Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyzeServiceUsage().sectorAnalysis.technoTransfer}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5">
                    {analyzeServiceUsage().sectorAnalysis.technoTransfer.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Popular Service Card */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-600 text-sm font-medium">Most Requested Service</h3>
            <p className="text-xl font-bold text-blue-700 mt-1">
              {analyzeServiceUsage().details.technoTransfer.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;