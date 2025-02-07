import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';

const CustomerReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const { staffVisitId } = useParams();  // Get staffVisitId from URL
  
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const [staffVisit, customerProfile, customerFeedback, libraryFeedback] = await Promise.all([
          axios.get(`http://localhost:5000/api/staff-visits/${staffVisitId}`),
          axios.get(`http://localhost:5000/api/customer-profiles?staffVisit=${staffVisitId}`),
          axios.get(`http://localhost:5000/api/customer-feedback?staffVisit=${staffVisitId}`),
          axios.get(`http://localhost:5000/api/library-feedback?staffVisit=${staffVisitId}`)
        ]);

        setReportData({
          staffVisit: staffVisit.data,
          customerProfile: customerProfile.data,
          customerFeedback: customerFeedback.data,
          libraryFeedback: libraryFeedback.data
        });
      } catch (err) {
        setError('Failed to fetch customer data');
      } finally {
        setLoading(false);
      }
    };

    if (staffVisitId) {
      fetchCustomerData();
    }
  }, [staffVisitId]);

  const downloadReport = () => {
    const reportJson = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-report-${reportData.customerProfile._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
      {error}
    </div>
  );

  if (!reportData) return null;

  const { staffVisit, customerProfile, customerFeedback, libraryFeedback } = reportData;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Customer Report</h1>
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download size={20} />
          Download Report
        </button>
      </div>

      {/* Staff Visit Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Staff Visit Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Visit</p>
            <p className="text-gray-800">{new Date(staffVisit.dateOfVisit).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Attending Staff</p>
            <p className="text-gray-800">{staffVisit.attendingStaff}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Services Inquired</p>
            <ul className="list-disc ml-5 text-gray-800">
              {staffVisit.tna && <li>Technology Needs Assessment (TNA)</li>}
              {staffVisit.technoTransfer.enabled && <li>Technology Transfer & Commercialization</li>}
              {staffVisit.technoConsultancy.enabled && <li>Technology Consultancy</li>}
              {staffVisit.projectProposalPreparation && <li>Project Proposal Preparation</li>}
              {staffVisit.packagingAndLabeling && <li>Packaging and Labeling</li>}
              {staffVisit.technologyTraining && <li>Technology Training</li>}
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Profile Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-gray-800">{customerProfile.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Organization</p>
            <p className="text-gray-800">{customerProfile.organizationName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Classification</p>
            <p className="text-gray-800">{customerProfile.classification}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Education Level</p>
            <p className="text-gray-800">{customerProfile.educationLevel}</p>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Feedback</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Satisfaction Ratings</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(customerFeedback.satisfaction).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-lg">
                    {'⭐'.repeat(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Recommendation Score</p>
            <p className="text-gray-800">{customerFeedback.recommendationScore}/10</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Suggestions</p>
            <p className="text-gray-800">{customerFeedback.suggestions || 'No suggestions provided'}</p>
          </div>
        </div>
      </section>

      {/* Library Feedback Section */}
      {libraryFeedback && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Library Feedback</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Queries Answered</p>
              <p className="text-gray-800">{libraryFeedback.queriesAnswered ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Main Reason for Visit</p>
              <p className="text-gray-800">{libraryFeedback.mainReason}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subjects of Interest</p>
              <ul className="list-disc ml-5 text-gray-800">
                {Object.entries(libraryFeedback.subjectsOfInterest)
                  .filter(([key, value]) => value && key !== 'othersSpecify')
                  .map(([key]) => (
                    <li key={key}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CustomerReport;