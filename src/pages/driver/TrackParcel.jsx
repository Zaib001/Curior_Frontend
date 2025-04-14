import React, { useEffect, useState, useRef } from 'react';
import { getTrackingInfo } from '../../services/driverService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import toast from 'react-hot-toast';
import L from 'leaflet';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchParcel = async (trackId) => {
    console.log(trackId)
    try {
      const res = await getTrackingInfo(trackId);
      setParcel(res);
    } catch {
      setParcel(null);
      toast.error('Parcel not found');
    }
  };

  const handleTrack = async () => {
    if (!trackingId) return toast.error('Please enter a tracking ID');
    setLoading(true);
    await fetchParcel(trackingId.trim());

    // Start interval after first successful fetch
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      fetchParcel(trackingId.trim());
    }, 15000); // Every 15 seconds

    setLoading(false);
  };

  useEffect(() => {
    // Clear interval on unmount
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-primary">Track Your Parcel</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </div>

      {parcel && (
        <div className="bg-white shadow rounded p-4 space-y-4">
          <div><strong>Tracking ID:</strong> {parcel.trackingId}</div>
          <div><strong>Receiver:</strong> {parcel.receiver}</div>
          <div><strong>Address:</strong> {parcel.address}</div>
          <div>
            <strong>Status:</strong>{' '}
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              {parcel.currentStatus}
            </span>
          </div>

          {parcel.currentLocation?.lat && parcel.currentLocation?.lng && (
            <div className="h-[300px] rounded overflow-hidden">
              <MapContainer
                center={[parcel.currentLocation.lat, parcel.currentLocation.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[parcel.currentLocation.lat, parcel.currentLocation.lng]} icon={defaultIcon}>
                  <Popup>Live parcel location</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
