// THIS IS THE LANDING PAGE OF THE SYSTEM
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import dostbackground from '../assets/dostbg.jpg'

const Landingpage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${dostbackground})` }}>
        {/* Overlay with multiple layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-blue-900/95" />
        
        {/* Pattern Overlay - adds subtle texture */}
        <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
             style={{
               backgroundImage: `url('/api/placeholder/1920/1080')`,
               backgroundSize: 'cover'
             }} />

        {/* Content Container */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center space-y-8"
          >
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl tracking-[0.2em] text-blue-200"
            >
              SHARE • RATE • IMPROVE
            </motion.p>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="text-blue-400">DOST</span>
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
                Customer Satisfaction Feedback System
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
            >
              Please take a moment to complete this short survey. Your responses
              will remain confidential and are greatly appreciated.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link
                to="/introduction"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full 
                         transition-all duration-300 inline-flex items-center justify-center gap-2
                         text-lg font-medium hover:shadow-lg hover:shadow-blue-500/30"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/learn-more"
                className="px-8 py-4 border-2 border-white/80 hover:border-white
                         rounded-full transition-all duration-300 inline-flex items-center 
                         justify-center gap-2 text-lg font-medium
                         hover:bg-white/10 hover:shadow-lg hover:shadow-white/20"
              >
                Learn More
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;