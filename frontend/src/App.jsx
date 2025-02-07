import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StaffInput from "./pages/StaffInput";
import SectionOne from "./pages/SectionOne";
import CustomerFeedback from "./pages/CustomerFeedback";
import LibraryFeedback from "./pages/LibraryFeedback";
import Navbar from "./Components/Layout/Navbar"
import CustomerReport from "./pages/CustomerReport";
import CustomerReviewDashboard from './pages/CustomerReviewDashboard';
import ReviewSummary from "./pages/ReviewSummary";

const App = () => {
  return (
    <Router>
        <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff-input" element={<StaffInput />} />
        <Route path="/SectionOne" element={<SectionOne />} />
        <Route path="/customer-feedback" element={<CustomerFeedback />} />
        <Route path="/library-feedback" element={<LibraryFeedback />} />
        <Route path="/Customer-Report" element={<CustomerReport />} />
        <Route path="/customer-review" element={<CustomerReviewDashboard />} />
        <Route path="/review-summary" element={<ReviewSummary />} />


      
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
