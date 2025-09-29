import React, { useState } from 'react';

const LocationSearch = ({ onLocationSelect, center, setCenter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const geocodeAddress = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const results = await response.json();
      
      if (results.length === 0) {
        setError('Location not found. Please try a different search term.');
        return;
      }

      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to search location. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    geocodeAddress(searchQuery);
  };

  const handleResultSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Extract city name from the geocoding result
    const city = extractCityName(result);
    
    // Update map center
    setCenter([lat, lng]);
    
    // Call the parent callback with location data
    onLocationSelect({
      lat,
      lng,
      city,
      fullAddress: result.display_name,
      osmData: result
    });

    // Clear search state
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError('');
  };

  const extractCityName = (result) => {
    const address = result.address;
    
    // Priority order for extracting city name
    if (address.city) return address.city;
    if (address.town) return address.town;
    if (address.village) return address.village;
    if (address.municipality) return address.municipality;
    if (address.district) return address.district;
    if (address.state) return address.state;
    if (address.county) return address.county;
    
    // Fallback to the first part of display_name
    const parts = result.display_name.split(',');
    return parts[0].trim();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setError('');
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      setError('');
    }
  };

  return (
    <div className="relative mb-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for a location (e.g., Connaught Place, New Delhi)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            disabled={isLoading}
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900">
                {extractCityName(result)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {result.display_name.length > 80 
                  ? result.display_name.substring(0, 80) + '...'
                  : result.display_name
                }
              </div>
              <div className="text-xs text-gray-500 mt-1">
                📍 {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Current Location Display */}
      {center && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            📍 Current location: {center[0].toFixed(4)}, {center[1].toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;

