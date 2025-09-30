import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMapEvents,
  Marker,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import axios from 'axios';
import LocationSearch from '../components/LocationSearch';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom component to handle map clicks and set center
function SetMapCenter({ setCenter }) {
  useMapEvents({
    click(e) {
      setCenter([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Custom component to handle map flyTo animation
function MapController({ flyToLocation, onAnimationComplete }) {
  const map = useMapEvents({});
  
  useEffect(() => {
    if (flyToLocation && map) {
      map.flyTo([flyToLocation.lat, flyToLocation.lng], 16, {
        duration: 1.5, // Animation duration in seconds
        easeLinearity: 0.1
      });
      
      // Reset the flyToLocation state after animation
      setTimeout(() => {
        onAnimationComplete();
      }, 1600); // Slightly longer than animation duration
    }
  }, [flyToLocation, map, onAnimationComplete]);
  
  return null;
}

// Custom component to initialize Leaflet Draw
function DrawControl({ onPolygonCreated, position = 'topright' }) {
  const map = useMapEvents({});
  const drawRef = useRef();

  useEffect(() => {
    if (!map) return;

    // ✅ STEP 1: Initialize FeatureGroup FIRST
    if (!drawRef.current) {
      drawRef.current = new L.FeatureGroup();
      map.addLayer(drawRef.current);
    }

    // ✅ STEP 2: Now safe to create Draw Control
    const drawControl = new L.Control.Draw({
      position: position,
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: '#e13e3e',
            message: 'Polygon edges cannot cross!',
          },
          shapeOptions: {
            color: '#3d84e6',
          },
        },
        circle: false,
        rectangle: true,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawRef.current, // ✅ Now guaranteed to exist
        remove: true,
      },
    });

    map.addControl(drawControl);

    // Handle draw events
    const onDrawCreated = (e) => {
      const layer = e.layer;
      drawRef.current.addLayer(layer);

      // Calculate area for polygon or rectangle
      let area = 0;
      if (e.layerType === 'polygon') {
        // Use LatLng objects directly (required by L.GeometryUtil)
        const latLngs = layer.getLatLngs()[0];
        area = Math.abs(L.GeometryUtil.geodesicArea(latLngs));
      } else if (e.layerType === 'rectangle') {
        const bounds = layer.getBounds();
        const latLngs = [
          bounds.getSouthWest(),
          bounds.getNorthWest(),
          bounds.getNorthEast(),
          bounds.getSouthEast(),
        ];
        area = Math.abs(L.GeometryUtil.geodesicArea(latLngs));
      }

      onPolygonCreated(area);
    };

    map.on(L.Draw.Event.CREATED, onDrawCreated);

    // Cleanup on unmount
    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, onDrawCreated);
      if (drawRef.current) {
        map.removeLayer(drawRef.current);
        drawRef.current = null;
      }
    };
  }, [map, onPolygonCreated, position]);

  return null;
}

const InputPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('map');
  const [roofArea, setRoofArea] = useState('');
  const [dwellers, setDwellers] = useState('');
  const [openSpace, setOpenSpace] = useState('');
  const [roofType, setRoofType] = useState('concrete');
  const [polygonArea, setPolygonArea] = useState(null);
  const [center, setCenter] = useState([28.6139, 77.2090]); // Delhi
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMarker, setShowMarker] = useState(false);
  const [flyToLocation, setFlyToLocation] = useState(null);

  // ✅ Create ref at top level — NOT inside JSX
  const featureGroupRef = useRef();

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setShowMarker(true);
    setCenter([locationData.lat, locationData.lng]);
    setFlyToLocation(locationData); // Trigger map animation
    console.log('Selected location:', locationData);
  };

  const handleAnimationComplete = () => {
    setFlyToLocation(null); // Reset animation state
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const inputData = {
      roof_area: activeTab === 'map' ? polygonArea : parseFloat(roofArea),
      dwellers: dwellers ? parseInt(dwellers) : undefined,
      open_space: openSpace ? parseFloat(openSpace) : undefined,
      roof_type: roofType,
      lat: center[0],
      lng: center[1],
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/assess', inputData);
      navigate('/results', { state: { ...response.data, input: inputData } });
    } catch (error) {
      console.error('Assessment failed:', error);
      alert('Error processing assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Enter Rooftop Details</h2>

        <div className="mb-6 border-b border-gray-300">
          <nav className="flex gap-3">
            <button
              className={`px-5 py-3 text-base rounded-lg font-medium ${
                activeTab === 'map'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('map')}
            >
              Draw on Map
            </button>
            <button
              className={`px-5 py-3 text-base rounded-lg font-medium ${
                activeTab === 'form'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('form')}
            >
              Manual Input
            </button>
          </nav>
        </div>

        {activeTab === 'map' && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Draw Your Rooftop</h3>
            
            {/* Location Search Component */}
            <LocationSearch 
              onLocationSelect={handleLocationSelect}
              center={center}
              setCenter={setCenter}
            />
            
            {/* Selected Location Display */}
            {selectedLocation && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📍 Selected Location</h4>
                <p className="text-blue-700">
                  <strong>City:</strong> {selectedLocation.city}
                </p>
                <p className="text-blue-700">
                  <strong>Address:</strong> {selectedLocation.fullAddress}
                </p>
                <p className="text-blue-700 text-sm">
                  <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            )}
            
            <div className="mb-4" style={{ height: '420px', width: '100%' }}>
              <MapContainer
                center={center}
                zoom={16}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {/* Map Controller for flyTo animation */}
                <MapController 
                  flyToLocation={flyToLocation} 
                  onAnimationComplete={handleAnimationComplete} 
                />
                
                {/* Marker for selected location */}
                {showMarker && selectedLocation && (
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                    <Popup>
                      <div>
                        <strong>{selectedLocation.city}</strong>
                        <br />
                        {selectedLocation.fullAddress}
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* ✅ Pass the ref here — created at top level */}
                <FeatureGroup ref={featureGroupRef}>
                  <SetMapCenter setCenter={setCenter} />
                  <DrawControl onPolygonCreated={setPolygonArea} />
                </FeatureGroup>
              </MapContainer>
            </div>
            {polygonArea && (
              <div className="bg-green-50 p-4 rounded">
                <p className="text-green-800 font-medium">
                  Calculated Roof Area: <span className="text-xl">{polygonArea.toFixed(2)} m²</span>
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'form' && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            {/* Location Search for Form Tab */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Select Your Location</h3>
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                center={center}
                setCenter={setCenter}
              />
              
              {/* Selected Location Display */}
              {selectedLocation && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📍 Selected Location</h4>
                  <p className="text-blue-700">
                    <strong>City:</strong> {selectedLocation.city}
                  </p>
                  <p className="text-blue-700">
                    <strong>Address:</strong> {selectedLocation.fullAddress}
                  </p>
                  <p className="text-blue-700 text-sm">
                    <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Roof Area (m²)*</label>
                <input
                  type="number"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 120"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Number of Dwellers</label>
                <input
                  type="number"
                  value={dwellers}
                  onChange={(e) => setDwellers(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 4"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Open Space (m²)</label>
                <input
                  type="number"
                  value={openSpace}
                  onChange={(e) => setOpenSpace(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Roof Type</label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="concrete">Concrete</option>
                  <option value="metal">Metal</option>
                  <option value="tiles">Tiles</option>
                  <option value="asphalt">Asphalt</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (activeTab === 'map' && !polygonArea) ||
              (activeTab === 'form' && !roofArea)
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow transition"
          >
            {isLoading ? 'Processing...' : 'Submit Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPage;