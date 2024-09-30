import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Maximize2, Minimize2 } from "lucide-react";

// Default Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LiveLocations = ({ devices }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to parse latLon strings
  const parseLatLon = (latLonStr) => {
    if (!latLonStr) return null;
    const [lat, lon] = latLonStr.split(",");
    const latitude = parseFloat(lat.trim());
    const longitude = parseFloat(lon.trim());
    if (isNaN(latitude) || isNaN(longitude)) return null;
    return { latitude, longitude };
  };

  // Filter out devices with invalid coordinates
  const validDevices = devices
    .map((device) => ({
      ...device,
      coordinates: parseLatLon(device.latLon),
    }))
    .filter((device) => device.coordinates);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Create custom marker icons
  const onlineIcon = L.divIcon({
    className: "custom-marker-icon",
    html: '<div class="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center shadow-md"></div>',
  });

  const offlineIcon = L.divIcon({
    className: "custom-marker-icon",
    html: '<div class="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-md"></div>',
  });

  return (
    <div
      className="bg-white p-2 rounded-lg relative"
      style={{
        height: isExpanded ? "75vh" : "40vh",
        width: "100%",
        borderRadius: "12px",
        transition: "height 0.3s ease-in-out",
      }}
    >
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          transition: "height 0.3s ease-in-out",
        }}
        className="-z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {validDevices.map((device) => (
          <Marker
            key={device.meterId}
            position={[
              device.coordinates.latitude,
              device.coordinates.longitude,
            ]}
            icon={device.status === "online" ? onlineIcon : offlineIcon}
          >
            <Popup>
              <div>
                <strong>Meter ID:</strong> {device.meterId}
                <br />
                <strong>Status:</strong> {device.status}
                <br />
                <strong>Location:</strong> {device.location}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button
        onClick={toggleExpand}
        className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
      >
        {isExpanded ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
      </button>
    </div>
  );
};

export default LiveLocations;
