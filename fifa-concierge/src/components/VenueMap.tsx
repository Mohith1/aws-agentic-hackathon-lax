import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { MapPin, Navigation, Clock, DollarSign } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Venue {
  id: string;
  name: string;
  coords: [number, number];
  capacity: number;
  address: string;
  upcomingMatches: number;
}

interface TransportOption {
  type: string;
  duration: string;
  cost: string;
  description: string;
  icon: string;
}

export const VenueMap: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const stadiums: Venue[] = [
    {
      id: '1',
      name: 'SoFi Stadium',
      coords: [33.9534, -118.3390],
      capacity: 70240,
      address: '1001 Stadium Dr, Inglewood, CA 90301',
      upcomingMatches: 8
    },
    {
      id: '2',
      name: 'Rose Bowl',
      coords: [34.1613, -118.1678],
      capacity: 88565,
      address: '1001 Rose Bowl Dr, Pasadena, CA 91103',
      upcomingMatches: 6
    },
    {
      id: '3',
      name: 'LA Memorial Coliseum',
      coords: [34.0141, -118.2879],
      capacity: 77500,
      address: '3911 S Figueroa St, Los Angeles, CA 90037',
      upcomingMatches: 5
    }
  ];

  const transportOptions: TransportOption[] = [
    {
      type: 'Metro',
      duration: '35 min',
      cost: '$3.50',
      description: 'Metro C Line to Hawthorne/Lennox + Shuttle',
      icon: '🚇'
    },
    {
      type: 'Uber/Lyft',
      duration: '15 min',
      cost: '$25-35',
      description: 'Direct ride to stadium entrance',
      icon: '🚗'
    },
    {
      type: 'Parking',
      duration: '20 min',
      cost: '$40-60',
      description: 'Pre-book parking for best rates',
      icon: '🅿️'
    },
    {
      type: 'Stadium Shuttle',
      duration: '45 min',
      cost: '$15',
      description: 'From downtown LA hotels',
      icon: '🚌'
    }
  ];

  // Example route line (simplified)
  const exampleRoute: [number, number][] = [
    [34.0522, -118.2437], // Downtown LA
    [33.9534, -118.3390]  // SoFi Stadium
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4 z-10">
        <h1 className="text-2xl font-bold text-fifa-blue flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Venue Navigator
        </h1>
        <p className="text-gray-600">Find stadiums, plan routes, and explore transportation options</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[34.0522, -118.2437]}
            zoom={11}
            className="h-full w-full"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Stadium Markers */}
            {stadiums.map(stadium => (
              <Marker
                key={stadium.id}
                position={stadium.coords}
                eventHandlers={{
                  click: () => setSelectedVenue(stadium)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{stadium.name}</h3>
                    <p className="text-sm text-gray-600">{stadium.address}</p>
                    <p className="text-sm mt-1">
                      <strong>Capacity:</strong> {stadium.capacity.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <strong>Upcoming:</strong> {stadium.upcomingMatches} matches
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Example Route */}
            <Polyline
              positions={exampleRoute}
              color="#0066B2"
              weight={4}
              opacity={0.7}
            />
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-[1000] space-y-2">
            <button className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
              <Navigation className="w-5 h-5 text-fifa-blue" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white shadow-lg overflow-y-auto">
          {selectedVenue ? (
            <div className="p-6">
              <button
                onClick={() => setSelectedVenue(null)}
                className="text-fifa-blue mb-4 hover:underline"
              >
                ← Back to all venues
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedVenue.name}
              </h2>
              <p className="text-gray-600 mb-4">{selectedVenue.address}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-xl font-bold text-fifa-blue">
                    {selectedVenue.capacity.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-xl font-bold text-fifa-green">
                    {selectedVenue.upcomingMatches} matches
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Transportation Options
              </h3>
              <div className="space-y-3">
                {transportOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-gray-100 rounded-lg p-4 hover:border-fifa-blue transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{option.icon}</span>
                        <h4 className="font-bold text-gray-800">{option.type}</h4>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{option.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-fifa-green font-semibold">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">{option.cost}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-fifa-blue to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-fifa-blue transition-all">
                Get Directions
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                FIFA 2026 Venues
              </h2>
              <p className="text-gray-600 mb-6">
                Select a stadium to view details and transportation options
              </p>

              <div className="space-y-4">
                {stadiums.map(stadium => (
                  <div
                    key={stadium.id}
                    onClick={() => setSelectedVenue(stadium)}
                    className="border-2 border-gray-100 rounded-lg p-4 hover:border-fifa-blue hover:shadow-md transition-all cursor-pointer"
                  >
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {stadium.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{stadium.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Capacity: {stadium.capacity.toLocaleString()}
                      </span>
                      <span className="bg-fifa-blue text-white text-xs px-2 py-1 rounded-full">
                        {stadium.upcomingMatches} matches
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-fifa-blue to-blue-600 rounded-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-blue-100">
                  Book transportation and parking in advance to save up to 40%! 
                  Traffic can be heavy on match days.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
