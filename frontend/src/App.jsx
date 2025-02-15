import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StaffInput from "./pages/StaffInput";
import SectionOne from "./pages/SectionOne";
import CustomerFeedback from "./pages/CustomerFeedback";
import LibraryFeedback from "./pages/LibraryFeedback";
import Navbar from "./Components/Layout/Navbar"
//import CustomerReviewDashboard from './pages/CustomerReviewDashboard';
import ReviewSummary from "./pages/ReviewSummary";
import Learnmore from "./pages/Learnmore"

import Introduction from "./pages/Introduction";




const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff-input" element={<StaffInput />} />
        <Route path="/SectionOne" element={<SectionOne />} />
        <Route path="/customer-feedback" element={<CustomerFeedback />} />
        <Route path="/library-feedback" element={<LibraryFeedback />} />
        {/*<Route path="/customer-review" element={<CustomerReviewDashboard />} />*/}
        <Route path="/review-summary" element={<ReviewSummary />} />
        <Route path="/learn-more" element={<Learnmore />} />
       
        <Route path="/introduction" element={<Introduction />} />
        

        




      
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
