import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, Star, Database, Cpu, ShieldCheck, 
  BarChart4, Zap, Activity, Sparkles, GitBranch 
} from "lucide-react";
import feedback from '../assets/feedback.gif';

const Introduction = () => {
  // Sample data for demonstration
  const [feedbackData, setFeedbackData] = useState([
    {
      _id: "1",
      customer: "Dr. Alex Chen",
      date: "2025-01-15",
      rating: 5,
      comment: "The neural-adaptive interface was remarkably responsive. Algorithm-driven recommendations were highly accurate to my needs."
    },
    {
      _id: "2",
      customer: "Maya Rodriguez, Data Engineer",
      date: "2025-01-10",
      rating: 4,
      comment: "Impressive quantum processing speeds. The system architecture handled complex queries efficiently with minimal latency."
    },
    {
      _id: "3",
      customer: "Kai Nakamura, Tech Lead",
      date: "2025-01-05",
      rating: 5,
      comment: "The blockchain verification protocol provided exceptional security. Seamless integration with our existing systems."
    }
  ]);

  const getRatingIcon = (rating) => {
    if (rating >= 4) return <Sparkles className="w-5 h-5 text-cyan-400" />;
    if (rating >= 3) return <Activity className="w-5 h-5 text-blue-400" />;
    return <GitBranch className="w-5 h-5 text-indigo-400" />;
  };

  // Tech-inspired animations
  const techReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    })
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Futuristic Hero Section */}
      <section className="relative h-screen overflow-hidden bg-black">
        {/* Tech grid background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        {/* Animated circuit-like lines */}
        <div className="absolute inset-0 overflow-hidden">
          <svg width="100%" height="100%" className="opacity-10">
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0, 210, 255, 0.3)" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60" />
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center pt-20 pb-16">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={techReveal}
            className="space-y-8 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-blue-900/30 backdrop-blur-xl px-6 py-2 rounded-full mb-4 border border-cyan-500/20">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-cyan-300">PSTO- Marinduque Customer Satisfaction feedback  System</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text">
              Share Your Thoughts,
              </span>
              <span className="text-white font-light">Help Us Improve </span>
            </h1>
            
            <p className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Your feedback matters! By sharing your experience, you help us enhance our services and better meet your needs. Thank you for taking the time to support our continuous improvement.
            </p>

            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 200, 255, 0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="flex justify-center"
            >
              <Link
                to="/staff-input"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                rounded-lg transition-all inline-flex items-center gap-3 font-semibold text-white border border-indigo-500/30 
                shadow-lg shadow-indigo-900/30 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center"
          >
            <div className="h-12 w-0.5 bg-gradient-to-b from-cyan-500 to-transparent mb-2" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Scroll to Analyze</span>
          </motion.div>
        </div>
      </section>

      {/* Data-Driven Value Proposition */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Tech pattern background */}
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
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-900/50 px-4 py-2 rounded-lg border border-indigo-700/30">
              <Database className="w-5 h-5 text-indigo-400" />
              <span className="font-mono text-indigo-300">DATA-DRIVEN DESIGN</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-cyan-300">Quantified Experience</span>
              <span className="block text-white font-light">Engineered Precision</span>
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Our quantum analytical engine processes feedback data through advanced neural networks, 
              transforming subjective experiences into actionable metrics with 99.7% accuracy.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-800/50 rounded-xl border border-cyan-900/30 backdrop-blur-sm hover:border-cyan-700/50 transition-colors group">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-cyan-900/20 group-hover:bg-cyan-900/40 transition-colors">
                  <BarChart4 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quantum Analytics</h3>
                <p className="text-sm text-gray-400">Processing feedback at 10^12 FLOPS capacity</p>
              </div>
              
              <div className="p-6 bg-gray-800/50 rounded-xl border border-indigo-900/30 backdrop-blur-sm hover:border-indigo-700/50 transition-colors group">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-indigo-900/20 group-hover:bg-indigo-900/40 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Cryptographic Privacy</h3>
                <p className="text-sm text-gray-400">256-bit AES encryption with quantum key distribution</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
            <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 bg-gray-800/40 backdrop-blur-sm">
              <img
                src={feedback}
                alt="Advanced feedback analytics"
                className="w-full h-auto filter brightness-90 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-transparent to-indigo-900/60" />
              
              {/* Tech UI overlay elements */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-md border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300">LIVE DATA STREAM</span>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-20 flex items-end justify-between px-6 pb-4 bg-gradient-to-t from-gray-900 to-transparent">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <div className="text-xs font-mono">
                    <div className="text-gray-400">PROCESSING POWER</div>
                    <div className="text-cyan-300">12.8 TFLOPS</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <div className="text-xs font-mono">
                    <div className="text-gray-400">NEURAL PATHWAYS</div>
                    <div className="text-indigo-300">2.4M ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feedback Showcase - Data Visualization Style */}
      <section className="py-24 bg-gray-800 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonales-decalees.png')] opacity-5" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/30 mb-4"
            >
              <GitBranch className="w-5 h-5 text-purple-400" />
              <span className="font-mono text-purple-300">NEURAL FEEDBACK REPOSITORY</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                Collective Intelligence Matrix
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Explore synthesized feedback from our quantum neural network
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbackData.map((feedback, index) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(66, 153, 225, 0.3)" }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative bg-gray-900 p-6 rounded-xl border border-gray-700 group-hover:border-indigo-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-20 h-20 -mt-2 -mr-2 overflow-hidden">
                    <div className="absolute transform rotate-45 bg-gradient-to-r from-cyan-400 to-indigo-500 text-xs text-white font-mono py-1 right-[-35px] top-[32px] w-[170px] text-center">
                      v{Math.floor(Math.random() * 10)}.{Math.floor(Math.random() * 10)}.{Math.floor(Math.random() * 10)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-900 to-indigo-900">
                      {getRatingIcon(feedback.rating)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{feedback.customer}</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-cyan-400 rounded-full" />
                        <p className="text-xs text-gray-400 font-mono">
                          REF: {feedback._id.padStart(6, '0')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase font-mono">Timestamp</div>
                        <div className="text-sm text-gray-300 font-mono">{new Date(feedback.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-5 border border-gray-700">
                    <p className="text-gray-300 line-clamp-3 font-light">
                      {feedback.comment}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-cyan-400">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="relative">
                          <Star 
                            className={`w-4 h-4 ${i < feedback.rating ? '' : 'text-gray-700'}`}
                            fill={i < feedback.rating ? 'currentColor' : 'none'}
                          />
                          {i < feedback.rating && (
                            <div className="absolute inset-0 blur-sm bg-cyan-400 opacity-30 rounded-full" />
                          )}
                        </div>
                      ))}
                      <span className="ml-2 text-sm font-mono text-gray-400">
                        {feedback.rating.toFixed(1)}/5.0
                      </span>
                    </div>
                    
                    <div className="text-xs font-mono text-gray-500 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      VERIFIED
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Futuristic CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-black relative overflow-hidden">
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden">
          <svg width="100%" height="100%" className="opacity-10">
            <rect width="100%" height="100%" fill="#000" />
            <g fill="none" stroke="rgba(0, 210, 255, 0.5)" strokeWidth="1">
              <circle cx="30%" cy="40%" r="160" />
              <circle cx="70%" cy="60%" r="120" />
              <path d="M 30 80 L 500 80 L 500 120 L 30 120 Z" />
            </g>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-b from-gray-900 to-black p-10 rounded-2xl border border-cyan-900/30 shadow-xl backdrop-blur-lg"
          >
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full blur opacity-50 animate-pulse" />
                <div className="relative bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full inline-flex items-center gap-2 border border-indigo-500/20">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-mono">INITIALIZE PROTOCOL</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text">
                Neural Input Required
              </span>
              <span className="block text-gray-100 font-light mt-2">
                Estimated Completion: 120 Seconds
              </span>
            </h2>
            
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Your cognitive input strengthens our quantum neural networks. Each feedback synapse creates exponential improvement in system performance.
            </p>
            
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(66, 153, 225, 0.4)"
              }}
              className="inline-block"
            >
              <Link
                to="/staff-input"
                className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 
                hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold text-white border border-cyan-500/30 
                shadow-lg shadow-blue-900/50 group overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-0 
                group-hover:opacity-20 transition-opacity" />
                
                <span className="relative flex items-center gap-3">
                  <span>Initialize Feedback Protocol</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
            
            <div className="mt-8 text-xs font-mono text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              SECURE QUANTUM ENCRYPTION ENABLED
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Introduction;