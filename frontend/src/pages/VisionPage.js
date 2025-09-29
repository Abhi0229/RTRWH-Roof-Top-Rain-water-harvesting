import React from 'react';
import { useNavigate } from 'react-router-dom';

const VisionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Vision for the Future</h2>
        
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
          <p className="text-xl text-gray-700 mb-6">
            This is our beta version. Thank you for being part of our journey to conserve every drop of rainwater.
          </p>
          
          <div className="space-y-4 text-left mb-8">
            <h3 className="text-2xl font-semibold text-indigo-700">🚀 Future Roadmap</h3>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-600">
              <li>AI-assisted roof detection from satellite imagery</li>
              <li>Augmented Reality (AR) visualization of harvesting structures</li>
              <li>Integration with Jal Shakti Ministry databases</li>
              <li>Mobile app with offline capabilities</li>
              <li>Real-time groundwater level monitoring integration</li>
              <li>Community challenges and rewards system</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-1 rounded-lg">
            <div className="bg-white p-6 rounded">
              <p className="text-lg font-medium text-gray-800">
                Together, we can build a water-secure India — one rooftop at a time.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition transform hover:scale-105"
        >
          Restart Assessment
        </button>
      </div>
    </div>
  );
};

export default VisionPage;