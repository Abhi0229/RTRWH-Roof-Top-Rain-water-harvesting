import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      
      {/* Main Content */}
      <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Rooftop Rainwater Harvesting
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Calculate your water harvesting potential and get personalized recommendations for sustainable water management.
        </p>
        
        <Link to="/input">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition transform hover:scale-105">
            Start Assessment
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;