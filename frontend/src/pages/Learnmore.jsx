//this is the page for LEARN MORE
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, MessageSquare, Star, ThumbsUp, CheckCircle } from "lucide-react";
import picture from '../assets/dostbg.jpg'

const LearnMore = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/customer-feedback/all');
        const data = await response.json();
        if (response.ok) {
          setFeedbackData(data);
        } else {
          console.error('Failed to fetch feedback:', data.message);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Share Your Thoughts",
      description: "Tell us about your experience with our services",
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Rate Our Service",
      description: "Help us maintain and improve our quality standards",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-green-600" />,
      title: "Make a Difference",
      description: "Your feedback shapes our future improvements",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90">
          <img
            src={picture} // Replace with your actual image
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-blue-900 opacity-90"></div>
        {/* Overlay for text highlighting */}
        <div className="absolute inset-0 bg-black opacity-0"></div>

        {/* Content Overlay */}
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">Welcome to Our Services!</h1>
            <h2 className="text-4xl md:text-5xl font-semibold text-blue-200 mb-8 drop-shadow-md">We Value Your Feedback</h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8">Your insights are crucial for us to enhance our services and ensure your satisfaction. Please take a moment to complete our customer feedback form.</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 justify-center"
            >
              <Link
                to="/staff-input"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-lg transform hover:scale-105 font-semibold text-lg"
              >
                Start Feedback Form
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mission and Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Mission and Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <h3 className="text-2xl font-semibold">Vision</h3>
              </div>
              <p className="text-lg text-gray-700">
                The standard of performance excellence and well-esteemed prime mover of Science,
                Technology, and Innovation (STI) for inclusive growth in MIMAROPA.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <ThumbsUp className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-semibold">Mission</h3>
              </div>
              <p className="text-lg text-gray-700">
                To plan and implement Science, Technology, and Innovation (STI) services toward
                inclusive regional development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Policy Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Quality Policy</h2>
          <p className="text-xl text-gray-700 text-center max-w-4xl mx-auto">
            We are committed to provide relevant services to both the government and private sectors
            in MIMAROPA Region with the highest standards of quality and reliability within our
            capabilities and resources according to customer and all applicable regulatory and
            statutory requirements and to continually improve the effectiveness of our QMS at all
            times in order to meet customer satisfaction.
          </p>
        </div>
      </section>

      {/* Importance of the System */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Why Your Feedback Matters</h2>
          <p className="text-lg text-gray-700 mb-4">
            Our Customer Satisfaction Feedback System is designed to ensure that your voice is heard.
            By participating, you help us understand your needs and expectations, allowing us to
            tailor our services to better serve you.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Your feedback is crucial for continuous improvement. It helps us identify areas where we
            excel and where we need to make changes. Together, we can create a better experience for
            everyone.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">How the Feedback System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Step 1: Complete the Survey</h3>
                <p>It only takes a few minutes to share your thoughts.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Step 2: Analyze Responses</h3>
                <p>Your responses are collected and analyzed to identify trends and areas for improvement.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Step 3: Implement Changes</h3>
                <p>We implement changes based on your feedback to enhance our services.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Step 4: See the Impact</h3>
                <p>You will see the impact of your feedback in our improved services and offerings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transform transition-transform"
              >
                <div className="flex flex-col items-center space-y-4">
                  {feature.icon}
                  <h4 className="text-xl font-semibold text-[#1a237e]">{feature.title}</h4>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      


      {/* Footer */}
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
                <li>
                  <Link to="/about" className="hover:text-blue-200 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/staff-input" className="hover:text-blue-200 transition-colors">
                    Our Services
                  </Link>image.png
                </li>
                <li>
                  <Link to="/programs" className="hover:text-blue-200 transition-colors">
                    Programs
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-200 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <img src="https://via.placeholder.com/24" alt="Facebook" className="w-6 h-6" />
                </a>
                <a
                  href="https://region4b.dost.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <img src="https://via.placeholder.com/24" alt="Website" className="w-6 h-6" />
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

export default LearnMore;