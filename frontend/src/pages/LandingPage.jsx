import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Atom, Database, Microscope, Cpu } from "lucide-react";
import dostbackground from '../assets/dostbg.jpg'

const LandingPage = () => {
  // Particle animation configuration
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-blue-950">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${dostbackground})` }}>
        {/* Overlay with sci-tech gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/95 via-blue-900/90 to-cyan-900/90" />
        
        {/* Geometric Pattern Overlay - adds tech texture */}
        <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
             style={{
               backgroundImage: `url('/api/placeholder/1920/1080')`,
               backgroundSize: 'cover'
             }} />

        {/* Animated Particles - represent molecules/data points */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-blue-400"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: 0.6,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 60 - 30],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center space-y-8"
          >
            {/* Tech Icon Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-8 mb-4"
            >
              <Atom className="w-8 h-8 text-cyan-400" />
              <Database className="w-8 h-8 text-blue-400" />
              <Microscope className="w-8 h-8 text-green-400" />
              <Cpu className="w-8 h-8 text-purple-400" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl tracking-[0.2em] text-cyan-200 font-mono"
            >
              INNOVATE • COLLABORATE • PROGRESS
            </motion.p>

            {/* Main Title with Tech Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="text-cyan-400 font-mono relative">
                  DOST
                  <span className="absolute -top-2 -right-6 text-sm text-cyan-300">2.0</span>
                </span>
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
                Customer Satisfaction Feedback System
              </h2>
            </motion.div>

            {/* Description with Scientific Emphasis */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
            >
              Your feedback powers our innovation. Help us analyze and improve our services 
              through this data-driven evaluation system.
            </motion.p>

            {/* Buttons with Tech Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link
                to="/introduction"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 text-lg font-medium border border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Begin Survey
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/learn-more"
                className="px-8 py-4 border-2 border-cyan-400/40 hover:border-cyan-400/80 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 text-lg font-medium hover:bg-cyan-900/20 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-400/10"
              >
                Learn  More
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Digital Data Visualization Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-16 flex justify-center"
            >
              <div className="px-6 py-3 rounded-full bg-blue-900/30 border border-blue-500/20 backdrop-blur-sm text-sm text-blue-200 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Real-time data collection in progress • {new Date().getFullYear()}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;