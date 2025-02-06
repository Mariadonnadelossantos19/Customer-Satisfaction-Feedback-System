import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import dostlogo from "../assets/dostlogo.png";
import iso from "../assets/iso.png";

const Landingpage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={dostlogo} alt="DOST Logo" className="h-8 w-8" />
            <span className="text-[#0066cc] font-semibold">
              DOST Marinduque
            </span>
          </div>
          <button className="px-6 py-1 text-[#0066cc] rounded-full border border-[#0066cc] hover:bg-blue-50 transition-colors">
            About us
          </button>
        </div>
      </nav>

      {/* Main Header */}
      <header className="bg-[#1a237e] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <img
              src={dostlogo}
              alt="DOST MIMAROPA Logo"
              className="h-24 w-24"
            />

            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
                DEPARTMENT OF SCIENCE AND TECHNOLOGY
              </h1>
              <h2 className="text-xl md:text-2xl mt-1 text-gray-200">
                MIMAROPA REGION
              </h2>
            </div>

            <img src={iso} alt="ISO Certification" className="h-24 w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a237e]">
              Welcome to DOST
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-blue-700">
              Customer Satisfaction Feedback System
            </h3>
          </div>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Please take a moment to complete this short survey. Your responses
            will remain confidential and are greatly appreciated. We look
            forward to hearing from you.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/staff-input"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#1a237e] text-white rounded-md
                       hover:bg-blue-900 transition-all duration-300 gap-2 text-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/learn-more"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#1a237e] 
                       text-[#1a237e] rounded-md hover:bg-blue-50 transition-all duration-300 gap-2 text-lg"
            >
              Learn More
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a237e] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <address className="not-italic space-y-2">
                <p>
                  DOST-MIMAROPA Regional Office, Calapan City, Oriental Mindoro
                </p>
                <p>(043) 288-5654</p>
                <p>mimaropa@region.dost.gov.ph</p>
              </address>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-200 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/staff-input"
                    className="hover:text-blue-200 transition-colors"
                  >
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/programs"
                    className="hover:text-blue-200 transition-colors"
                  >
                    Programs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-blue-200 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://region4b.dost.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  Website
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} DOST MIMAROPA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
