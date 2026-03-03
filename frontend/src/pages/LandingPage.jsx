import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ChevronRight, Atom, Database, Microscope, Cpu,
  Star, ShieldCheck, BarChart4, Zap, Activity, Sparkles, GitBranch,
} from "lucide-react";
import dostbackground from "../assets/dostbg.jpg";
import feedback from "../assets/feedback.gif";

const LandingPage = () => {
  const [feedbackData] = useState([
    {
      _id: "1",
      customer: "Dr. Alex Chen",
      date: "2025-01-15",
      rating: 5,
      comment: "The neural-adaptive interface was remarkably responsive. Algorithm-driven recommendations were highly accurate to my needs.",
    },
    {
      _id: "2",
      customer: "Maya Rodriguez, Data Engineer",
      date: "2025-01-10",
      rating: 4,
      comment: "Impressive quantum processing speeds. The system architecture handled complex queries efficiently with minimal latency.",
    },
    {
      _id: "3",
      customer: "Kai Nakamura, Tech Lead",
      date: "2025-01-05",
      rating: 5,
      comment: "The blockchain verification protocol provided exceptional security. Seamless integration with our existing systems.",
    },
  ]);

  const getRatingIcon = (rating) => {
    if (rating >= 4) return <Sparkles className="w-5 h-5 text-cyan-400" />;
    if (rating >= 3) return <Activity className="w-5 h-5 text-blue-400" />;
    return <GitBranch className="w-5 h-5 text-indigo-400" />;
  };

  const techReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] },
    }),
  };

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
              <a
                href="#get-started"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 text-lg font-medium border border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Begin Survey
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/learn-more"
                className="px-8 py-4 border-2 border-cyan-400/40 hover:border-cyan-400/80 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 text-lg font-medium hover:bg-cyan-900/20 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-400/10"
              >
                Learn  More
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Admin Access Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-8"
            >
              <Link
                to="/admin-login"
                className="text-sm text-cyan-300 hover:text-cyan-200 underline underline-offset-4 transition-colors duration-200"
              >
                Admin Access
              </Link>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-16 flex justify-center"
            >
              <a
                href="#get-started"
                className="flex flex-col items-center text-cyan-300/80 hover:text-cyan-300 transition-colors"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-10 w-0.5 bg-gradient-to-b from-cyan-400 to-transparent mb-2" />
                  <span className="text-xs uppercase tracking-widest font-mono">Scroll to continue</span>
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Get Started / Introduction section - merged from Introduction page */}
      <section id="get-started" className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke="white" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-900/50 px-4 py-2 rounded-lg border border-indigo-700/30">
              <Database className="w-5 h-5 text-indigo-400" />
              <span className="font-mono text-indigo-300">DATA-DRIVEN DESIGN</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              <span className="text-cyan-300">Share Your Thoughts,</span>
              <span className="block font-light">Help Us Improve</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Your feedback matters! By sharing your experience, you help us enhance our services and better meet your needs. Thank you for taking the time to support our continuous improvement.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-800/50 rounded-xl border border-cyan-900/30 backdrop-blur-sm hover:border-cyan-700/50 transition-colors group">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-cyan-900/20 group-hover:bg-cyan-900/40 transition-colors">
                  <BarChart4 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Actionable Insights</h3>
                <p className="text-sm text-gray-400">Your feedback powers our improvement metrics</p>
              </div>
              <div className="p-6 bg-gray-800/50 rounded-xl border border-indigo-900/30 backdrop-blur-sm hover:border-indigo-700/50 transition-colors group">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-indigo-900/20 group-hover:bg-indigo-900/40 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-400">Your data is protected and used only to improve services</p>
              </div>
            </div>
            <Link
              to="/staff-input"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold text-white border border-cyan-500/30 shadow-lg shadow-blue-900/50 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur-xl opacity-20" />
            <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 bg-gray-800/40 backdrop-blur-sm">
              <img src={feedback} alt="Feedback analytics" className="w-full h-auto brightness-90 contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-transparent to-indigo-900/60" />
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-md border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300">DOST-MIMAROPA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feedback Showcase */}
      <section className="py-24 bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/30 mb-4"
            >
              <GitBranch className="w-5 h-5 text-purple-400" />
              <span className="font-mono text-purple-300">CUSTOMER FEEDBACK</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
            >
              Your Voice Matters
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Join others who have helped us improve through their feedback
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbackData.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-900 to-indigo-900">
                    {getRatingIcon(item.rating)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.customer}</h3>
                    <p className="text-xs text-gray-400 font-mono">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm line-clamp-3 mb-4">{item.comment}</p>
                <div className="flex items-center gap-1 text-cyan-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < item.rating ? "" : "text-gray-700"}`}
                      fill={i < item.rating ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">{item.rating}/5</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gray-900/80 p-10 rounded-2xl border border-cyan-900/30 shadow-xl backdrop-blur-lg"
          >
            <div className="inline-flex items-center gap-2 bg-cyan-900/30 px-6 py-3 rounded-full border border-cyan-500/20 mb-6">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-mono">READY TO START</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text">
                Share Your Experience
              </span>
              <span className="block text-gray-100 font-light mt-2 text-lg">
                Help us improve our services in minutes
              </span>
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Your feedback strengthens our ability to serve you better. Each response helps us understand what matters most to you.
            </p>
            <Link
              to="/staff-input"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold text-white border border-cyan-500/30 shadow-lg shadow-blue-900/50 group"
            >
              Start Feedback
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="mt-8 text-xs font-mono text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Secure submission
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-400">
              Department of Science and Technology — MIMAROPA Region
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Customer Satisfaction Feedback System
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-400">
              Developed by <span className="text-cyan-400 font-medium">Ma. Donna D. Fidelino</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;