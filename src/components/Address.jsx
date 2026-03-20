import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2, Navigation, CheckCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker component that handles map clicks
function LocationMarker({ position, setPosition, onLocationChange }) {
  const [dragging, setDragging] = useState(false);

  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      await reverseGeocode(lat, lng, onLocationChange);
    },
  });

  const reverseGeocode = async (lat, lng, callback) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'PetRideFuelApp/1.0'
          }
        }
      );
      const data = await response.json();
      
      if (data.display_name) {
        callback({
          address: data.display_name,
          latitude: lat,
          longitude: lng,
        });
        console.log('Address updated:', lat, lng, data.display_name);
        toast.success('Location updated');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      toast.error('Failed to get address from location');
    }
  };

  const eventHandlers = {
    dragstart: () => setDragging(true),
    dragend: async (e) => {
      setDragging(false);
      const marker = e.target;
      const position = marker.getLatLng();
      setPosition({ lat: position.lat, lng: position.lng });
      await reverseGeocode(position.lat, position.lng, onLocationChange);
    },
  };

  useEffect(() => {
    if (position && map) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <Marker
      position={[position.lat, position.lng]}
      draggable={true}
      eventHandlers={eventHandlers}
    />
  );
}

export function AddressMapInput({ onAddressChange, initialAddress = '' }) {
  const [address, setAddress] = useState(initialAddress);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Default to Lagos, Nigeria
  const defaultPosition = { lat: 6.5244, lng: 3.3792 };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setPosition({ lat, lng });
          setShowMap(true);
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
              {
                headers: {
                  'User-Agent': 'PetRideFuelApp/1.0'
                }
              }
            );
            const data = await response.json();
            
            setAddress(data.display_name);
            onAddressChange({
              address: data.display_name,
              latitude: lat,
              longitude: lng,
            });
            toast.success('Current location detected');
          } catch (error) {
            console.error('Reverse geocoding error:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get your location');
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  // Search for address (geocode)
  const searchAddress = async () => {
    if (!address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=ng&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'PetRideFuelApp/1.0'
          }
        }
      );
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setPosition({ lat, lng });
        setAddress(result.display_name);
        setShowMap(true);

        onAddressChange({
          address: result.display_name,
          latitude: lat,
          longitude: lng,
        });

        toast.success('Address found!');
      } else {
        toast.error('Address not found. Please try a different search.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to search address');
    } finally {
      setLoading(false);
    }
  };

  // Get suggestions as user types
  const handleAddressInput = async (value) => {
    setAddress(value);
    
    if (value.length > 3) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=ng&limit=5`,
          {
            headers: {
              'User-Agent': 'PetRideFuelApp/1.0'
            }
          }
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Suggestion error:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    setAddress(suggestion.display_name);
    setPosition({ lat, lng });
    setShowSuggestions(false);
    setSuggestions([]);
    setShowMap(true);

    onAddressChange({
      address: suggestion.display_name,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleLocationChange = (locationData) => {
    setAddress(locationData.address);
    setPosition({ lat: locationData.latitude, lng: locationData.longitude });
    onAddressChange(locationData);
  };

  return (
    <div className="space-y-4">
      {/* Address Input */}
      <div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className='flex gap-2 flex-1'>
            <div className="flex-1 relative">
              <input
                type="text"
                value={address}
                onChange={(e) => handleAddressInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
                className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl pl-10 pr-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                placeholder="Enter delivery address..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888]" />
            </div>
            
            <button
              onClick={searchAddress}
              disabled={loading}
              className="bg-[#f2fd7d] text-black hover:bg-[#e8f171] font-semibold px-6 rounded-xl transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
            </div>

            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="border border-[#343434] text-[#fcfcfc] hover:bg-[#141414] hover:border-[#f2fd7d] font-semibold px-6 rounded-xl transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Use My Location
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-[#0a0a0a] border border-[#343434] rounded-xl overflow-hidden shadow-xl">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-[#141414] transition-colors border-b border-[#343434] last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#f2fd7d] mt-1 flex-shrink-0" />
                    <p className="text-[#fcfcfc] text-sm leading-relaxed">
                      {suggestion.display_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[#888] text-xs mt-2">
          Type an address, or click "Use My Location" to auto-detect
        </p>
      </div>

      {/* Coordinates Display */}
      {position && (
        <div className="bg-[#141414] border border-[#343434] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-[#fcfcfc] font-semibold text-sm mb-1">Location Verified</p>
                <p className="text-[#888] text-xs font-mono">
                  {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="border border-[#343434] text-[#fcfcfc] hover:bg-[#1a1a1a] hover:border-[#f2fd7d] px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      {showMap && position && (
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl overflow-hidden">
          <div className="bg-[#141414] px-4 py-3 border-b border-[#343434]">
            <p className="text-[#fcfcfc] font-semibold text-sm mb-1">
              📍 Verify Location on Map
            </p>
            <p className="text-[#888] text-xs">
              Drag the marker or click anywhere on the map to adjust your delivery location
            </p>
          </div>
          
          <div className="h-[400px]">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                position={position}
                setPosition={setPosition}
                onLocationChange={handleLocationChange}
              />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}