import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StaffInput from "./pages/StaffInput";
import SectionOne from "./pages/SectionOne";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff-input" element={<StaffInput />} />
        <Route path="/SectionOne" element={<SectionOne />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
