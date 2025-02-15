//THIS IS FOR THE INPUT FIELD OF CUSTOMER PROFILE
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const classifications = [
  "Student",
  "Owner of a business",
  "Employee of a business",
  "Government employee",
  "Professional",
  "Overseas Filipino Worker",
  "Not employed",
  "Others",
];
const ageGroup = [
  "15 & below",
  "16-20",
  "21-30",
  "31-40",
  "41-50",
  "51-59",
  "60 & above",
];
const sex = [
  "Male",
  "Female",
];
const educationLevel = [
  "Elementary",
  "High School",
  "College",
  "Masters/ PhD.",
  "Others"
];
const  subjectsOfInterest=[
  "agriHorticulture",
  "aquacultureMarine",
  "furniture",
  "foodProcessing",
  "giftsHousewaresDecors",
  "healthAndPharma",
  "ict",
  "metalsAndEngineering",
  "others"

]

const ReviewSummary = () => {
  const [searchParams] = useSearchParams();
  const staffVisitId = searchParams.get("staffVisitId");
  const customerFeedbackId = searchParams.get("customerFeedbackId");
  const customerProfileId = searchParams.get("customerProfileId");

  const [summaryData, setSummaryData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  //const customerProfileId = new URLSearchParams(location.search).get('customerProfileId');
  const [customerData, setCustomerData] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/review-summary/${staffVisitId}/${customerFeedbackId}`);
        setSummaryData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [staffVisitId, customerFeedbackId]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      console.log("Customer Profile ID:", customerProfileId);
      if (!customerProfileId) {
        console.error("No customer profile ID provided.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/customer-profiles/${customerProfileId}`);
        setCustomerData(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Error fetching customer data:", error.response.data);
          if (error.response.status === 404) {
            console.error("Customer profile not found. Please check the ID.");
          }
        } else if (error.request) {
          console.error("No response received from the server.");
        } else {
          console.error("Error:", error.message);
        }
      }
    };

    fetchCustomerData();
  }, [customerProfileId]);

  const handleSubmitReview = async () => {
    // Ensure all necessary data is included
    const reviewData = {
      staffVisit: summaryData.staffVisit,
      customerProfile: summaryData.customerProfile,
      customerFeedback: summaryData.customerFeedback,
      libraryFeedback: summaryData.libraryFeedback,
    };

    console.log("Review Data to be saved:", reviewData); // Log the review data for debugging

    
    try {
      const response = await axios.post("http://localhost:5000/api/review-summary", reviewData);
      if (response.status === 201) {
        navigate('/thank-you'); // Redirect to thank you page on success
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(`Error: ${error.response?.data?.message || "An error occurred while submitting your review."}`);
    }
  };

  if (!summaryData) {
    return <div>Loading...</div>;
  }

  const { staffVisit } = summaryData;

  return (
    <div className="text-xs">
      <div className="max-w-4xl mx-auto p-6">
        <div className="border rounded-lg shadow-md">
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
                <p><strong>Date of visit/encounter:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex-1 text-right">
                <p><strong>Attending Staff:</strong> {summaryData.staffVisit.attendingStaff || 'N/A'}</p>
              </div>
            </div>
          </div>

          {summaryData && (
            <div className="p-4">
              {/* Services Inquired Section */}
              <h2 className="text-lg font-semibold mb-4">Services Inquired on/availed:</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Technology Transfer & Commercialization (SETUP/GIA)</h3>
                  <div className="flex flex-col">
                    {Object.entries(staffVisit.technoTransfer.sectors).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input type="checkbox" checked={value} readOnly />
                        <span className="ml-2">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                    ))}
                    {staffVisit.technoTransfer.othersSpecify && (
                      <div className="flex items-center">
                        <input type="checkbox" checked={true} readOnly />
                        <span className="ml-2">Others: {staffVisit.technoTransfer.othersSpecify}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Technical Consultancy</h3>
                  <div className="flex flex-col">
                    {Object.entries(staffVisit.technoConsultancy.services).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input type="checkbox" checked={value} readOnly />
                        <span className="ml-2">{key}</span>
                      </div>
                    ))}
                    {staffVisit.technoConsultancy.othersSpecify && (
                      <div className="flex items-center">
                        <input type="checkbox" checked={true} readOnly />
                        <span className="ml-2">Others: {staffVisit.technoConsultancy.othersSpecify}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Services Section */}
              <div className="mb-6 border-b pb-4">
                <h2 className="text-lg font-semibold mb-4">Additional Services</h2>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <input type="checkbox" checked={staffVisit.projectProposalPreparation} readOnly />
                    <span className="ml-2">Project Proposal Preparation</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked={staffVisit.packagingAndLabeling} readOnly />
                    <span className="ml-2">Packaging and Labeling</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked={staffVisit.technologyTraining} readOnly />
                    <span className="ml-2">Technology Training</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked={staffVisit.scholarship} readOnly />
                    <span className="ml-2">Scholarship</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked={staffVisit.library.enabled} readOnly />
                    <span className="ml-2">Library Services</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked={staffVisit.laboratory.enabled} readOnly />
                    <span className="ml-2">Laboratory Services</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked={staffVisit.others.enabled} readOnly />
                    <span className="ml-2">Others: {staffVisit.others.specify}</span>
                  </div>
                </div>
              </div>

              {/* Customer Profile Section */}
              <div className="mb-6 border-b pb-4">
                <h2 className="text-lg font-semibold mb-4">SECTION 1: CUSTOMER'S PROFILE</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Full Name:</strong> {summaryData.customerProfile?.name || 'N/A'}</p>
                    <p><strong>Organization:</strong> {summaryData.customerProfile?.organizationName || 'N/A'}</p>
                    <p><strong>Address:</strong> {summaryData.customerProfile?.address || 'N/A'}</p>
                    <p><strong>Contact:</strong> {summaryData.customerProfile?.contactInfo || 'N/A'}</p>
                    <p><strong>Classification:</strong></p>
                    <ul className="list-none pl-0">
                      {classifications.map((option) => (
                        <li key={option}>
                          {summaryData.customerProfile?.classification === option ? `[✓] ${option}` : `[ ] ${option}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p><strong>First Visit:</strong> {summaryData.customerProfile?.firstVisit ? '[ ✓ ] Yes' : '[ ✓ ] No'}</p>
                    <p><strong>Sex:</strong></p>
                    <ul className="list-none pl-0">
                      {sex.map((option) => (
                        <li key={option}>
                          {summaryData.customerProfile?.sex === option ? `[✓] ${option}` : `[ ] ${option}`}
                        </li>
                      ))}
                    </ul>
                    <p><strong>PWD:</strong> {summaryData.customerProfile?.disability ? '[ ✓ ] Yes' : '[ ✓ ] No'}</p>
                    
                    <p><strong>Age Group:</strong></p>
                    <ul className="list-none pl-0">
                      {ageGroup.map((option) => (
                        <li key={option}>
                          {summaryData.customerProfile?.ageGroup === option ? `[✓] ${option}` : `[ ] ${option}`}
                        </li>
                      ))}
                    </ul>
                    <p><strong>Level of Education:</strong></p>
                    <ul className="list-none pl-0">
                      {educationLevel.map((option) => (
                        <li key={option}>
                          {summaryData.customerProfile?.educationLevel === option ? `[✓] ${option}` : `[ ] ${option}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Customer Feedback Section */}
              <div className="mb-6 border-b pb-4">
                <h2 className="text-lg font-semibold mb-4">SECTION 2: CUSTOMER EVALUATION/FEEDBACK</h2>
                <table className="w-full mb-4">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Drivers of Satisfaction</th>
                      <th className="p-2">Very Satisfied</th>
                      <th className="p-2">Satisfied</th>
                      <th className="p-2">Neutral</th>
                      <th className="p-2">Dissatisfied</th>
                      <th className="p-2">Very Dissatisfied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(summaryData.customerFeedback.satisfaction).map(([key, value]) => (
                      <tr key={key} className="border-t">
                        <td className="p-2">{key.replace(/([A-Z])/g, " $1").trim()}</td>
                        <td className="p-2 text-center">{value === 5 ? '[✓]' : '[ ]'}</td>
                        <td className="p-2 text-center">{value === 4 ? '[✓]' : '[ ]'}</td>
                        <td className="p-2 text-center">{value === 3 ? '[✓]' : '[ ]'}</td>
                        <td className="p-2 text-center">{value === 2 ? '[✓]' : '[ ]'}</td>
                        <td className="p-2 text-center">{value === 1 ? '[✓]' : '[ ]'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mb-4">
                  <p className="font-semibold mb-2">How likely is it that you would recommend/endorse DOST's services to others?</p>
                  <div className="flex justify-between">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="text-center">
                        <div className={`border p-2 rounded ${summaryData.customerFeedback.recommendationScore === i ? 'bg-blue-500 text-white' : ''}`}>
                          {i}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Not at all likely</span>
                    <span>Extremely likely</span>
                  </div>
                  <p><strong>Suggestions:</strong> <br ></br>
                  {summaryData.customerFeedback?.suggestions || 'N/A'}</p>

                </div>
              </div>

              {/* Library Section */}
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">SECTION 3: FOR LIBRARY USERS ONLY</h2>
                <div className="space-y-4">
                  <p><strong>Queries Answered:</strong> {summaryData.libraryFeedback.queriesAnswered ? '[ ✓ ] Yes' : '[ ✓ ] No'}</p>
                  
                  <div>
                  <h2 className="font-semibold">Please specify subject of interest</h2>
                  <div className="flex flex-col">
                    {Object.entries(summaryData.libraryFeedback.subjectsOfInterest).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input type="checkbox" checked={value} readOnly />
                        <span className="ml-2">{key}</span>
                      </div>
                      
                    ))}
                    <p><strong>Main Reason:</strong> {summaryData.libraryFeedback.mainReason}</p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmitReview}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;