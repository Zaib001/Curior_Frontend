import React, { useEffect, useState } from 'react';
import { getAllParcels, getAllDrivers, assignDriver } from '../../services/adminService';
import toast from 'react-hot-toast';

const AssignDriver = () => {
  const [parcels, setParcels] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const parcelRes = await getAllParcels();
      const driverRes = await getAllDrivers();
      const unassigned = (parcelRes.data || parcelRes).filter(p => !p.driverId);
      setParcels(unassigned);
      setDrivers(driverRes);
    } catch {
      toast.error('Failed to load data.');
    }
  };

  const toggleSelect = (id) => {
    setSelectedParcels(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedDriver || selectedParcels.length === 0) {
      toast.error('Select driver and parcels.');
      return;
    }

    try {
      await assignDriver({ parcelIds: selectedParcels, driverId: selectedDriver });
      toast.success('Driver assigned!');
      setSelectedParcels([]);
      setSelectedDriver('');
      loadData();
    } catch {
      toast.error('Failed to assign driver.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Assign Driver</h2>

      <div className="bg-white p-4 rounded shadow">
        <label className="block mb-2 font-medium text-sm">Select Driver</label>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-4"
        >
          <option value="">-- Select Driver --</option>
          {drivers.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.email})
            </option>
          ))}
        </select>

        <div className="overflow-x-auto max-h-[300px] border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Select</th>
                <th className="p-2 text-left">Parcel ID</th>
                <th className="p-2 text-left">Tracking ID</th>
                <th className="p-2 text-left">Receiver</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedParcels.includes(p._id)}
                      onChange={() => toggleSelect(p._id)}
                    />
                  </td>
                  <td className="p-2">{p._id}</td>
                  <td className="p-2">{p.trackingId}</td>
                  <td className="p-2">{p.receiver}</td>
                </tr>
              ))}
              {parcels.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 p-4">No unassigned parcels</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleAssign}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Assign Selected Parcels
        </button>
      </div>
    </div>
  );
};

export default AssignDriver;
