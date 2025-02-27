import React, { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CongratulationsModal = ({ isOpen, onClose, redirectPath = "/" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Disable scroll on body when modal is open
      document.body.style.overflow = "hidden";
      
      // Cleanup function
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 ease-out scale-100 border border-blue-400/30"
        style={{
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)"
        }}
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
      >
        <div className="p-8 text-center relative overflow-hidden">
          {/* Abstract circuit-like patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-16 h-32 border-t-2 border-l-2 border-blue-400 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-32 border-b-2 border-r-2 border-blue-400 rounded-br-3xl"></div>
            <div className="absolute top-10 right-10 w-6 h-6 border-2 border-blue-400 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-6 h-6 border-2 border-blue-400 rounded-full"></div>
          </div>
          
          {/* Success icon with pulse effect */}
          <div className="relative">
            <div className="w-20 h-20 bg-blue-900/50 rounded-full mx-auto flex items-center justify-center mb-6 border-2 border-blue-400">
              <FiCheckCircle className="w-10 h-10 text-blue-400" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Success!</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Your feedback has been processed and securely uploaded to our data center. Thank you for helping us optimize our library services.
          </p>
          
          <button
            onClick={handleClose}
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg
              hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900"
          >
            <span className="relative inline-flex items-center">
              <span className="mr-2">Continue</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratulationsModal;