import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDriverParcels } from '../../services/driverService';
import toast from 'react-hot-toast';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DriverLiveMap = () => {
  const [parcels, setParcels] = useState([]);
  const intervalRef = useRef(null);

  const fetchParcels = async () => {
    try {
      const data = await getDriverParcels();
      setParcels(data);
    } catch {
      toast.error('Failed to fetch parcel locations');
    }
  };

  useEffect(() => {
    fetchParcels();
    intervalRef.current = setInterval(fetchParcels, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const center = parcels.find(p => p.currentLocation)?.currentLocation || { lat: 51.505, lng: -0.09 };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Live Parcel Map</h2>

      <div className="h-[500px] w-full rounded overflow-hidden">
        <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {parcels
            .filter(p => p.currentLocation?.lat && p.currentLocation?.lng)
            .map((p) => (
              <Marker key={p._id} position={[p.currentLocation.lat, p.currentLocation.lng]} icon={icon}>
                <Popup>
                  <div className="text-sm">
                    <div><strong>Tracking:</strong> {p.trackingId}</div>
                    <div><strong>Recipient:</strong> {p.receiver}</div>
                    <div><strong>Status:</strong> {p.currentStatus}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default DriverLiveMap;
