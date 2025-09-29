import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_assessments: 0, total_litres: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Mock leaderboard data
  const leaderboard = [
    { colony: "Colony A", litres: 250000, rank: 1 },
    { colony: "Colony B", litres: 180000, rank: 2 },
    { colony: "Colony C", litres: 120000, rank: 3 },
    { colony: "Colony D", litres: 95000, rank: 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Community Impact Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Assessments</h3>
            <p className="text-5xl font-bold text-blue-600">{stats.total_assessments}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Water Recharged</h3>
            <p className="text-5xl font-bold text-green-600">{Math.round(stats.total_litres).toLocaleString()}</p>
            <p className="text-gray-600">litres</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Community Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Colony</th>
                  <th className="px-4 py-3 text-right">Litres Recharged</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item) => (
                  <tr key={item.colony} className="border-b">
                    <td className="px-4 py-3 font-bold">{item.rank}</td>
                    <td className="px-4 py-3">{item.colony}</td>
                    <td className="px-4 py-3 text-right">{item.litres.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/vision')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            See Our Vision →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;