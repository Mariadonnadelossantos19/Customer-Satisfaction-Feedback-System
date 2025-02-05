import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandinPage";
import StaffInput from "./pages/StaffInput";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff-input" element={<StaffInput />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
