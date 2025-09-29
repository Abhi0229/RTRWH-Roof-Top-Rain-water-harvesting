import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  const downloadReport = () => {
    // Dummy PDF download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
      `RTRWH Assessment Report\n\n` +
      `Roof Area: ${result.input.roof_area} m²\n` +
      `Annual Rainfall: ${result.annual_rainfall.toFixed(2)} mm\n` +
      `Captured Volume: ${result.captured_volume.toLocaleString()} litres/year\n` +
      `Recommended Structure: ${result.structure_type}\n` +
      `Dimensions: ${result.dimensions}\n` +
      `Estimated Cost: ₹${result.cost.toLocaleString()}\n`
    ));
    element.setAttribute('download', 'rtrwh-assessment-report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Assessment Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">💧 Harvesting Potential</h3>
              <p className="text-4xl font-bold text-blue-600">{result.captured_volume.toLocaleString()}</p>
              <p className="text-gray-600">litres per year</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">🏗️ Recommended Structure</h3>
              <p className="text-2xl font-bold text-green-600">{result.structure_type}</p>
              <p className="text-gray-600">{result.dimensions}</p>
              <p className="mt-2 font-semibold text-lg">Cost: ₹{result.cost.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">📍 Location Data</h3>
            <p>Latitude: {result.input.lat.toFixed(6)}</p>
            <p>Longitude: {result.input.lng.toFixed(6)}</p>
            <p>Annual Rainfall: {result.annual_rainfall.toFixed(2)} mm</p>
            <p>Groundwater Depth: 10m (hardcoded)</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadReport}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow transition transform hover:scale-105"
            >
              📄 Download Report
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition transform hover:scale-105"
            >
              📊 View Community Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;