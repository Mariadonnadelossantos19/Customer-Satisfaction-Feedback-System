import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, MessageSquare, Star, ThumbsUp, Users } from "lucide-react";

const Landingpage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Share Your Thoughts",
      description: "Tell us about your experience with our services"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Rate Our Service",
      description: "Help us maintain and improve our quality standards"
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-green-600" />,
      title: "Make a Difference",
      description: "Your feedback shapes our future improvements"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation Bar - keeping original code */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/api/placeholder/32/32" alt="DOST Logo" className="h-8 w-8" />
            <span className="text-[#0066cc] font-semibold">DOST Marinduque</span>
          </div>
          <button className="px-6 py-1 text-[#0066cc] rounded-full border border-[#0066cc] hover:bg-blue-50 transition-colors">
            About us
          </button>
        </div>
      </nav>

      {/* Main Header - keeping original code with animation */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-[#1a237e] text-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <img src="/api/placeholder/96/96" alt="DOST MIMAROPA Logo" className="h-24 w-24" />
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
                DEPARTMENT OF SCIENCE AND TECHNOLOGY
              </h1>
              <h2 className="text-xl md:text-2xl mt-1 text-gray-200">
                MIMAROPA REGION
              </h2>
            </div>
            <img src="/api/placeholder/96/96" alt="ISO Certification" className="h-24 w-24" />
          </div>
        </div>
      </motion.header>

      {/* Enhanced Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl w-full text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a237e]">
              Welcome to DOST
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-blue-700">
              Customer Satisfaction Feedback System
            </h3>
          </motion.div>

          <motion.p 
            {...fadeIn}
            className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
          >
            Please take a moment to complete this short survey. Your responses
            will remain confidential and are greatly appreciated. We look
            forward to hearing from you.
          </motion.p>

          {/* Feature Cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center space-y-4">
                  {feature.icon}
                  <h4 className="text-xl font-semibold text-[#1a237e]">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/staff-input"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#1a237e] text-white rounded-md
                       hover:bg-blue-900 transition-all duration-300 gap-2 text-lg group"
            >
              Get Started
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>

            <Link
              to="/learn-more"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#1a237e] 
                       text-[#1a237e] rounded-md hover:bg-blue-50 transition-all duration-300 gap-2 text-lg"
            >
              Learn More
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer - keeping original code */}
      <footer className="bg-[#1a237e] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <address className="not-italic space-y-2">
                <p>DOST-MIMAROPA Regional Office, Calapan City, Oriental Mindoro</p>
                <p>(043) 288-5654</p>
                <p>mimaropa@region.dost.gov.ph</p>
              </address>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-blue-200 transition-colors">About Us</Link></li>
                <li><Link to="/staff-input" className="hover:text-blue-200 transition-colors">Our Services</Link></li>
                <li><Link to="/programs" className="hover:text-blue-200 transition-colors">Programs</Link></li>
                <li><Link to="/contact" className="hover:text-blue-200 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                  Facebook
                </a>
                <a href="https://region4b.dost.gov.ph" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
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