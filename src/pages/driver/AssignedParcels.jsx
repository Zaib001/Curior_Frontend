import React, { useState, useEffect } from 'react';
import {
  getAssignedParcels,
  updateParcelStatus,
  getRealTimeLocation,
  exportParcelsToCSV
} from '../../services/driverService';

const AssignedParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingLocation, setTrackingLocation] = useState(null);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await getAssignedParcels();
        setParcels(data);
      } catch (err) {
        setError('Failed to fetch assigned parcels');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, []);

  // Track Location
  const handleTrackLocation = async (parcelId) => {
    try {
      const location = await getRealTimeLocation(parcelId);
      setTrackingLocation(location);
    } catch (error) {
      setError('Failed to fetch location');
    }
  };

  // Update Status
  const handleStatusChange = async (parcelId, status) => {
    try {
      await updateParcelStatus(parcelId, status);
      setParcels((prev) =>
        prev.map((parcel) =>
          parcel.id === parcelId ? { ...parcel, status } : parcel
        )
      );
      alert('Status updated successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    exportParcelsToCSV(parcels);
  };

  const filteredParcels = filter
    ? parcels.filter((p) => p.status === filter)
    : parcels;

  const getBadgeColor = (status) => {
    switch (status) {
      case 'Assigned': return 'bg-blue-100 text-blue-700';
      case 'Picked Up': return 'bg-yellow-100 text-yellow-700';
      case 'In Transit': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading parcels...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <select
          className="border px-3 py-2 rounded-md text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Assigned">Assigned</option>
          <option value="Picked Up">Picked Up</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>

        <button
          onClick={handleExportCSV}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition text-sm"
        >
          📤 Export Logs as CSV
        </button>
      </div>

      {/* Location Tracker Display */}
      {trackingLocation && (
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <strong>Current Location:</strong> {trackingLocation.latitude}, {trackingLocation.longitude}
        </div>
      )}

      {/* Parcel Table */}
      <div className="bg-white rounded-xl shadow-card overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-medium">Parcel ID</th>
              <th className="p-3 text-left font-medium">Tracking ID</th>
              <th className="p-3 text-left font-medium">Receiver</th>
              <th className="p-3 text-left font-medium">Address</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map((parcel) => (
              <tr key={parcel.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{parcel.id}</td>
                <td className="p-3">{parcel.trackingId}</td>
                <td className="p-3">{parcel.receiver}</td>
                <td className="p-3">{parcel.address}</td>
                <td className="p-3">
                  <select
                    value={parcel.status}
                    onChange={(e) => handleStatusChange(parcel.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(parcel.status)}`}
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleTrackLocation(parcel.id)}
                    className="text-blue-500 hover:underline"
                  >
                    📍 Track Location
                  </button>
                </td>
              </tr>
            ))}
            {filteredParcels.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No parcels found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedParcels;
