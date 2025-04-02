import React, { useState, useEffect } from 'react';
import { getAllParcels, getAllDrivers, assignDriverToParcel } from '../../services/adminService';
import toast from 'react-hot-toast';

const AssignDriver = () => {
  const [parcels, setParcels] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parcelRes = await getAllParcels();
        const driverRes = await getAllDrivers();
        setParcels(parcelRes.data || []);
        setDrivers(driverRes || []);
      } catch (error) {
        toast.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedParcelId || !selectedDriverId) {
      toast.error('Please select both parcel and driver');
      return;
    }

    try {
      await assignDriverToParcel(selectedParcelId, selectedDriverId);
      toast.success('Driver assigned successfully!');
      setSelectedParcelId('');
      setSelectedDriverId('');
    } catch (error) {
      toast.error('Failed to assign driver.');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold text-primary">Assign Driver to Parcel</h2>

      <div className="space-y-4 bg-white shadow-md rounded-md p-5">
        {/* Select Parcel */}
        <div>
          <label className="block mb-1 text-sm font-medium">Select Parcel</label>
          <select
            className="w-full border px-4 py-2 rounded-md text-sm"
            value={selectedParcelId}
            onChange={(e) => setSelectedParcelId(e.target.value)}
          >
            <option value="">-- Select Parcel --</option>
            {parcels.map((p) => (
              <option key={p._id} value={p._id}>
                {p.trackingId} — {p.receiver}
              </option>
            ))}
          </select>
        </div>

        {/* Select Driver */}
        <div>
          <label className="block mb-1 text-sm font-medium">Select Driver</label>
          <select
            className="w-full border px-4 py-2 rounded-md text-sm"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
          >
            <option value="">-- Select Driver --</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.email})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition text-sm"
        >
          Assign Driver
        </button>
      </div>
    </div>
  );
};

export default AssignDriver;
