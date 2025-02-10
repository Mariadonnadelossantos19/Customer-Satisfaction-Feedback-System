import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ReactToPrint from 'react-to-print';

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

const sex = ["Male", "Female"];

const educationLevel = [
  "Elementary",
  "High School",
  "College",
  "Masters/ PhD.",
  "Others",
];

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
});

const MyDocument = ({ summaryData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Review Summary</Text>
        <Text style={styles.text}>Customer Name: {summaryData.customerProfile?.name || 'N/A'}</Text>
        <Text style={styles.text}>Feedback: {summaryData.customerFeedback || 'N/A'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Subjects of Interest</Text>
        {Object.keys(summaryData.subjectsOfInterest || {}).map((key) => (
          <Text key={key} style={styles.text}>
            {summaryData.subjectsOfInterest[key] ? `[✓] ${key}` : `[ ] ${key}`}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

class ComponentToPrint extends React.Component {
  render() {
    const { summaryData } = this.props;
    return (
      <div className="max-w-4xl mx-auto p-6" id="review-summary">
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

          <div className="p-4">
            {/* Services Inquired Section */}
            <h2 className="text-lg font-semibold mb-4">Services Inquired on/availed:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Technology Transfer & Commercialization (SETUP/GIA)</h3>
                <div className="flex flex-col">
                  {Object.entries(summaryData.staffVisit.technoTransfer.sectors).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={value} 
                        readOnly 
                        className="form-checkbox h-4 w-4"
                      />
                      <span className="ml-2">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                  {summaryData.staffVisit.technoTransfer.othersSpecify && (
                    <div className="flex items-center">
                      <input type="checkbox" checked={true} readOnly />
                      <span className="ml-2">Others: {summaryData.staffVisit.technoTransfer.othersSpecify}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Technical Consultancy</h3>
                <div className="flex flex-col">
                  {Object.entries(summaryData.staffVisit.technoConsultancy.services).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input type="checkbox" checked={value} readOnly />
                      <span className="ml-2">{key}</span>
                    </div>
                  ))}
                  {summaryData.staffVisit.technoConsultancy.othersSpecify && (
                    <div className="flex items-center">
                      <input type="checkbox" checked={true} readOnly />
                      <span className="ml-2">Others: {summaryData.staffVisit.technoConsultancy.othersSpecify}</span>
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
                  <input type="checkbox" checked={summaryData.staffVisit.projectProposalPreparation} readOnly />
                  <span className="ml-2">Project Proposal Preparation</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" checked={summaryData.staffVisit.packagingAndLabeling} readOnly />
                  <span className="ml-2">Packaging and Labeling</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" checked={summaryData.staffVisit.technologyTraining} readOnly />
                  <span className="ml-2">Technology Training</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" checked={summaryData.staffVisit.scholarship} readOnly />
                  <span className="ml-2">Scholarship</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" checked={summaryData.staffVisit.library.enabled} readOnly />
                  <span className="ml-2">Library Services</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" checked={summaryData.staffVisit.laboratory.enabled} readOnly />
                  <span className="ml-2">Laboratory Services</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" checked={summaryData.staffVisit.others.enabled} readOnly />
                  <span className="ml-2">Others: {summaryData.staffVisit.others.specify}</span>
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

            {/* Subject of Interest Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">SECTION 3: FOR LIBRARY USERS ONLY</h2>
              <div className="space-y-4">
                <p><strong>Queries Answered:</strong> {summaryData.libraryFeedback.queriesAnswered ? '[ ✓ ] Yes' : '[ ✓ ] No'}</p>
                <p><strong>Subject of Interest:</strong></p>
                <ul className="list-none pl-0">
                  {summaryData.subjectsOfInterest && typeof summaryData.subjectsOfInterest === 'object' ? (
                    Object.keys(summaryData.subjectsOfInterest).map((key) => (
                      <li key={key} onClick={() => handleSubjectClick(key)} style={{ cursor: 'pointer' }}>
                        {summaryData.subjectsOfInterest[key] ? `[✓] ${key}` : `[ ] ${key}`}
                      </li>
                    ))
                  ) : (
                    <li>No subjects of interest available.</li>
                  )}
                </ul>
                <p><strong>Main Reason:</strong> {summaryData.libraryFeedback.mainReason}</p>
              </div>
            </div>

            {/* Summary Review Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Selected Subjects of Interest</h2>
              <ul className="list-none pl-0">
                {Object.keys(summaryData.subjectsOfInterest || {}).map((key) => (
                  summaryData.subjectsOfInterest[key] && <li key={key}>[✓] {key}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ReviewSummary = () => {
  const [searchParams] = useSearchParams();
  const staffVisitId = searchParams.get("staffVisitId");
  const customerFeedbackId = searchParams.get("customerFeedbackId");
  const [summaryData, setSummaryData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const customerProfileId = new URLSearchParams(location.search).get('customerProfileId');
  const [customerData, setCustomerData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [subjectsOfInterest, setSubjectsOfInterest] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState({});
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
      if (!customerProfileId) {
        console.error("No customer profile ID provided.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/customer-profiles/${customerProfileId}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();
  }, [customerProfileId]);

  const handleSubmitReview = async () => {
    const reviewData = {
      staffVisit: summaryData.staffVisit,
      customerProfile: summaryData.customerProfile,
      customerFeedback: summaryData.customerFeedback,
      libraryFeedback: summaryData.libraryFeedback,
    };

    try {
      await axios.post("http://localhost:5000/api/reviews", reviewData);
      navigate('/thank-you');
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDownloadAndPrintPDF = async () => {
    const input = document.getElementById("review-summary");
    if (!input) {
      console.error("Review summary element not found");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Capture the content of the review summary
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Width of the image in the PDF
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save("review-summary.pdf");

      // Open the PDF in a new tab for printing
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.print();
          printWindow.onafterprint = function () {
            printWindow.close(); // Close the print window after printing
          };
        };
      } else {
        console.error("Failed to open print window. Please check your popup blocker settings.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const fetchSubjectsOfInterest = async () => {
    try {
      const response = await axios.get('/api/libraryUserFeedback');
      setSubjectsOfInterest(response.data.subjectsOfInterest || {});
    } catch (error) {
      console.error('Error fetching subjects of interest:', error);
    }
  };

  useEffect(() => {
    fetchSubjectsOfInterest();
  }, []);

  const handleSubjectClick = (key) => {
    setSelectedSubjects((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!summaryData) {
    return <div>Loading...</div>;
  }

  const { staffVisit } = summaryData;

  return (
    <div>
      <ComponentToPrint summaryData={summaryData} />
      <ReactToPrint
        trigger={() => <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">Print</button>}
        content={() => componentRef.current}
      />
      <PDFDownloadLink
        document={<MyDocument summaryData={summaryData} />}
        fileName="review-summary.pdf"
      >
        {({ loading }) => (loading ? 'Preparing Document...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default ReviewSummary;