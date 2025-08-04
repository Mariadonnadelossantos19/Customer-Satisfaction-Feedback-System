import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import {
  FiDownload,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiList,
  FiInfo,
  FiFilter,
  FiLogOut,
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
  LabelList,
} from 'recharts';

const Reports = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('overview');

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

  // Download Service Distribution as CSV
  const downloadReport = () => {
    const services = Object.values(analyzeServiceUsage().details);
    const csv = Papa.unparse(
      services.map(service => ({
        'Service Name': service.name,
        'Total Requests': service.count,
        'Percentage of Total Services': service.percentage + '%',
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `service-distribution-report-${new Date().toISOString().slice(0,10)}.csv`);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Total Customers</h3>
            <FiUsers className="text-blue-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {calculateCustomerUsage().yearly.find(y => y.year === selectedYear.toString())?.customers || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total customers for {selectedYear}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Average Satisfaction</h3>
            <FiBarChart2 className="text-green-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {(calculateSatisfactionMetrics().reduce((acc, curr) => acc + parseFloat(curr.value), 0) / 
              calculateSatisfactionMetrics().length).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Out of 5.0 rating</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Most Popular Service</h3>
            <FiPieChart className="text-purple-500 text-xl" />
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">
            {analyzeServiceUsage().details.technoTransfer.name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {analyzeServiceUsage().details.technoTransfer.percentage}% of total services
          </p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Customer Trends</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={generateMonthlyTrends()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#8884d8" 
                name="Satisfaction Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSatisfactionTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Satisfaction Metrics</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calculateSatisfactionMetrics()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" name="Satisfaction Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculateSatisfactionMetrics().map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-700 mb-4">{metric.name}</h3>
            <div className="flex items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(metric.value / 5) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 text-lg font-semibold text-gray-700">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServicesTab = () => {
    // Hanapin ang top service
    const services = Object.values(analyzeServiceUsage().details);
    const topService = services.reduce((max, curr) => (curr.count > max.count ? curr : max), services[0]);
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Service Distribution</h2>
          <p className="text-gray-500 mb-6">
            Ipinapakita ng graph na ito ang dami ng requests para sa bawat serbisyo. Mas mataas ang bar, mas maraming gumagamit ng serbisyo. Ang mga detalye sa ibaba ay nagpapakita ng eksaktong bilang at porsyento ng bawat serbisyo.
          </p>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={services}
                layout="vertical"
                margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
                barCategoryGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} fontSize={14} />
                <YAxis type="category" dataKey="name" width={220} fontSize={14} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Total Requests" isAnimationActive={true}>
                  {services.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {/* Value labels sa dulo ng bar */}
                  <LabelList dataKey="count" position="right" fontSize={16} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-white p-6 rounded-xl shadow-sm border transition-all duration-200 ${
                service.name === topService.name
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-[1.03]'
                  : 'border-gray-200'
              }`}
            >
              {service.name === topService.name && (
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">Most Requested</span>
              )}
              <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                {/* Optional: maglagay ng icon dito kung gusto mo */}
                {service.name}
              </h3>
              <div className="mt-2">
                <p className="text-3xl font-bold text-gray-900">{service.count}</p>
                <p className="text-sm text-gray-500 mt-1">Total requests</p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-200"
                    style={{
                      width: `${service.percentage}%`,
                      background: COLORS[index % COLORS.length],
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{service.percentage}% ng lahat ng serbisyo</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Analytics Reports</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiDownload className="mr-2" /> Download Report
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
            title="Mag-logout"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('satisfaction')}
              className={`${
                activeTab === 'satisfaction'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Satisfaction
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Services
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'satisfaction' && renderSatisfactionTab()}
      {activeTab === 'services' && renderServicesTab()}
    </div>
  );
};

export default Reports;