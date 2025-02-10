// INTRODUCTION IS THE BEGINNING OF BEFORE THE SURVEY
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Smile, Frown, Meh } from "lucide-react";
import picture from "../assets/picture2.png"

const Introduction = () => {
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

  const getRatingIcon = (rating) => {
    if (rating >= 4) return <Smile className="w-6 h-6 text-green-600" />;
    if (rating >= 3) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Frown className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative h-screen-70 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Shape Our Service<br/>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                With Your Feedback
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Your voice drives our improvement. Share your experience and help us craft better moments for everyone.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Link
                to="/staff-input"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg hover:bg-white/20 rounded-xl transition-all 
                inline-flex items-center gap-3 font-semibold text-white border border-white/20 shadow-lg"
              >
                Start Feedback Form
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Star className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-600">Customer-Centric Design</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Experience,<br/>
              Our Priority
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We've built this platform with your convenience in mind. Share your thoughts through our intuitive 
              feedback system and watch how we transform your suggestions into tangible improvements.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-blue-50 shadow-sm">
                <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-sm text-gray-600">See how feedback impacts our decisions</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-50 shadow-sm">
                <h3 className="font-semibold mb-2">100% Anonymous</h3>
                <p className="text-sm text-gray-600">Your privacy is guaranteed</p>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20"
          >
            <img
              src={picture}
              alt="Feedback process"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Feedback Showcase Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Voices That Shape Us
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Discover what our community is saying about their experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbackData.map((feedback) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{feedback.customer}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(feedback.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getRatingIcon(feedback.rating)}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {feedback.comment}
                </p>
                
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < feedback.rating ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 px-6 py-3 rounded-full mb-6">
            <span className="text-white/80 text-sm">Ready to contribute?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Share Your Experience in Just 2 Minutes
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link
              to="/staff-input"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-lg 
              font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Feedback Form
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Introduction;