import React, { useEffect, useState } from 'react';
import {
  getDriverParcels,
  updateParcelStatus,
  updateParcelLocation
} from '../../services/driverService';
import toast from 'react-hot-toast';

const statusOptions = ['Picked Up', 'In Transit', 'Delivered', 'Returned'];

const getBadge = (status) => {
  const base = 'px-2 py-1 rounded-full text-xs font-medium ';
  switch (status) {
    case 'Picked Up': return base + 'bg-blue-100 text-blue-700';
    case 'In Transit': return base + 'bg-yellow-100 text-yellow-700';
    case 'Delivered': return base + 'bg-green-100 text-green-700';
    case 'Returned': return base + 'bg-red-100 text-red-700';
    case 'Created': return base + 'bg-gray-100 text-gray-600';
    default: return base + 'bg-gray-200 text-gray-600';
  }
};

const DriverDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState({}); // parcelId → new status
  const [updatingLocation, setUpdatingLocation] = useState(false);

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const res = await getDriverParcels();
      setParcels(res);
    } catch {
      toast.error('Failed to load assigned parcels');
    }
  };

  const handleStatusChange = (parcelId, status) => {
    setUpdatingStatus((prev) => ({ ...prev, [parcelId]: status }));
  };

  const handleUpdateStatus = async (parcelId) => {
    const status = updatingStatus[parcelId];
    if (!status) return toast.error('Please select a status');

    try {
      await updateParcelStatus(parcelId, status);
      toast.success('Status updated');
      fetchParcels();
      setUpdatingStatus((prev) => ({ ...prev, [parcelId]: '' }));
    } catch {
      toast.error('Status update failed');
    }
  };

  const handleUpdateLocation = async (parcelId) => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation not supported');
    }

    setUpdatingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await updateParcelLocation(parcelId, { lat: latitude, lng: longitude });
          toast.success('Location updated');
        } catch {
          toast.error('Failed to update location');
        } finally {
          setUpdatingLocation(false);
        }
      },
      (err) => {
        toast.error('Location fetch failed');
        setUpdatingLocation(false);
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Driver Dashboard</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Tracking ID</th>
              <th className="p-3 text-left">Recipient</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Update Status</th>
              <th className="p-3 text-left">Update Location</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.trackingId}</td>
                <td className="p-3">{p.receiver}</td>
                <td className="p-3">{p.address}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">
                  <span className={getBadge(p.currentStatus)}>{p.currentStatus}</span>
                </td>
                <td className="p-3 flex gap-2">
                  <select
                    value={updatingStatus[p._id] || ''}
                    onChange={(e) => handleStatusChange(p._id, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="">-- Select --</option>
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(p._id)}
                    className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark"
                  >
                    Update
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleUpdateLocation(p._id)}
                    disabled={updatingLocation}
                    className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
                  >
                    {updatingLocation ? 'Updating...' : 'Update Location'}
                  </button>
                </td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  No assigned parcels
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverDashboard;
