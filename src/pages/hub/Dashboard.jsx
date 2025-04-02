import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import {
  getHubStatusSummary,
  getParcelsByStatus,
  updateParcelStatus,
  getRealTimeLocation,
} from '../../services/hubService';
import Modal from '../../components/Modal';

const HubDashboard = () => {
  const [statusSummary, setStatusSummary] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Status Summary and Parcels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await getHubStatusSummary();
        console.log('Status Summary API Response:', summaryResponse);

        // If API returns { data: [...] }
        setStatusSummary(Array.isArray(summaryResponse.data) ? summaryResponse.data : []);

        const parcelsResponse = await getParcelsByStatus(filter);
        setParcels(Array.isArray(parcelsResponse) ? parcelsResponse : []);
      } catch (error) {
        console.error('Error fetching hub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  // Update Parcel Status
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedParcel) return;
    try {
      await updateParcelStatus(selectedParcel._id, newStatus);
      setParcels((prev) =>
        prev.map((p) =>
          p._id === selectedParcel._id ? { ...p, currentStatus: newStatus } : p
        )
      );
      setSelectedParcel(null);
    } catch (error) {
      console.error('Error updating parcel status:', error);
    }
  };

  // Real-time location tracking (optional)
  const fetchRealTimeLocation = async (parcelId) => {
    try {
      const location = await getRealTimeLocation(parcelId);
      console.log('Real-Time Location:', location);
    } catch (error) {
      console.error('Error fetching real-time location:', error);
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case 'At Hub':
        return 'bg-blue-100 text-blue-700';
      case 'Dispatched':
        return 'bg-green-100 text-green-700';
      case 'Delivered':
        return 'bg-purple-100 text-purple-700';
      case 'Returned':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const columns = [
    { header: 'Parcel ID', accessor: '_id' },
    { header: 'Tracking ID', accessor: 'trackingId' },
    { header: 'Receiver', accessor: 'receiver' },
    {
      header: 'Status',
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getBadge(
            row.currentStatus
          )}`}
        >
          {row.currentStatus}
        </span>
      ),
    },
  ];

  if (loading) return <div className="text-center">Loading data...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-primary">Hub Dashboard</h2>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.isArray(statusSummary) &&
          statusSummary.map((status, i) => (
            <div
              key={i}
              className="p-5 bg-white shadow-card rounded-xl text-center cursor-pointer"
              onClick={() => setFilter(status.label)}
            >
              <div className="text-xl font-bold text-primary">{status.count}</div>
              <div className="text-sm text-gray-500">{status.label}</div>
            </div>
          ))}
      </div>

      {/* Filter Dropdown */}
      <div className="flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          <option value="At Hub">At Hub</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      {/* Parcel Table */}
      <DataTable
        title="Parcels at Hub"
        columns={columns}
        data={parcels}
        onRowClick={setSelectedParcel}
      />

      {/* Modal */}
      <Modal
        isOpen={!!selectedParcel}
        onClose={() => setSelectedParcel(null)}
        title={`Parcel Details - ${selectedParcel?.trackingId}`}
      >
        {selectedParcel && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Receiver:</strong> {selectedParcel.receiver}
            </p>
            <p>
              <strong>Address:</strong> {selectedParcel.address}
            </p>
            <p>
              <strong>Status:</strong> {selectedParcel.currentStatus}
            </p>

            <div>
              <label htmlFor="status">Update Status:</label>
              <select
                id="status"
                value={selectedParcel.currentStatus}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="ml-2 border px-3 py-2 rounded-md text-sm"
              >
                <option value="At Hub">At Hub</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            <button
              onClick={() => fetchRealTimeLocation(selectedParcel._id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Track Parcel (Real-Time)
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HubDashboard;
