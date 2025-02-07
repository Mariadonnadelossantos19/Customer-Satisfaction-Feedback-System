import { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const ReviewFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customer-feedback/all');
        setFeedbackData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch feedback data');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleDownloadPDF = () => {
    const element = document.getElementById('feedback-content');
    const opt = {
      margin: 1,
      filename: 'customer-feedback-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const renderServiceDetails = (feedback) => {
    return (
      <div className="space-y-2 mt-4">
        <h4 className="font-medium">Services Availed:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {feedback.tna && <li>TNA</li>}
          
          {feedback.technoTransfer.enabled && (
            <li>
              Techno Transfer - Sectors:
              <ul className="list-circle pl-5">
                {Object.entries(feedback.technoTransfer.sectors).map(([key, value]) => (
                  value && key !== 'others' && (
                    <li key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</li>
                  )
                ))}
                {feedback.technoTransfer.sectors.others && (
                  <li>Others: {feedback.technoTransfer.othersSpecify}</li>
                )}
              </ul>
            </li>
          )}

          {feedback.technoConsultancy.enabled && (
            <li>
              Techno Consultancy Services:
              <ul className="list-circle pl-5">
                {Object.entries(feedback.technoConsultancy.services).map(([key, value]) => (
                  value && key !== 'others' && (
                    <li key={key}>{key.toUpperCase()}</li>
                  )
                ))}
                {feedback.technoConsultancy.services.others && (
                  <li>Others: {feedback.technoConsultancy.othersSpecify}</li>
                )}
              </ul>
            </li>
          )}

          {feedback.projectProposalPreparation && <li>Project Proposal Preparation</li>}
          {feedback.packagingAndLabeling && <li>Packaging and Labeling</li>}
          {feedback.technologyTraining && <li>Technology Training</li>}
          {feedback.technologyClinics.enabled && <li>{feedback.technologyClinics.name}</li>}
          {feedback.scholarship && <li>Scholarship</li>}
          {feedback.laboratory.enabled && <li>{feedback.laboratory.name}</li>}
          {feedback.library.enabled && <li>Library Services: {feedback.library.name}</li>}
          {feedback.others.enabled && <li>Others: {feedback.others.specify}</li>}
        </ul>
        <p><strong>Referral Source:</strong> {feedback.referralSource}</p>
      </div>
    );
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Feedback Review</h1>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF Report
        </button>
      </div>

      <div id="feedback-content">
        {/* Feedback Display Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow mb-8">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Speed & Timeliness</th>
                <th className="px-6 py-3 text-left">Quality</th>
                <th className="px-6 py-3 text-left">Relevance</th>
                <th className="px-6 py-3 text-left">Staff Competence</th>
                <th className="px-6 py-3 text-left">Staff Attitude</th>
                <th className="px-6 py-3 text-left">Overall</th>
                <th className="px-6 py-3 text-left">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {feedbackData.map((feedback, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{feedback.satisfaction.speedAndTimeliness}</td>
                  <td className="px-6 py-4">{feedback.satisfaction.qualityOfService}</td>
                  <td className="px-6 py-4">{feedback.satisfaction.relevanceOfService}</td>
                  <td className="px-6 py-4">{feedback.satisfaction.staffCompetence}</td>
                  <td className="px-6 py-4">{feedback.satisfaction.staffAttitude}</td>
                  <td className="px-6 py-4">{feedback.satisfaction.overallPerception}</td>
                  <td className="px-6 py-4">{feedback.recommendationScore}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbackData.map((feedback, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">
                Feedback #{index + 1} - {new Date(feedback.createdAt).toLocaleDateString()}
              </h3>
              
              {renderServiceDetails(feedback)}
              
              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-medium">Suggestions: </span>
                  {feedback.suggestions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewFeedback; 