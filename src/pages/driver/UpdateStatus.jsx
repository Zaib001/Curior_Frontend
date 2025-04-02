import React, { useState } from 'react';
import { updateParcelStatus } from '../../services/driverService';
import { Toaster, toast } from 'react-hot-toast';

const UpdateStatus = () => {
  const [parcelId, setParcelId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ API Call to Update Status
      await updateParcelStatus(parcelId, status);
      toast.success(`✅ Status updated to "${status}" for Parcel ID: ${parcelId}`);
      setParcelId('');
      setStatus('');
    } catch (error) {
      toast.error('❗ Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-card space-y-6">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-semibold text-primary">Update Parcel Status</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Parcel ID Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Parcel ID</label>
          <input
            type="text"
            value={parcelId}
            onChange={(e) => setParcelId(e.target.value)}
            required
            placeholder="e.g. PCL001"
            className="w-full border px-4 py-2 rounded-md shadow-sm text-sm"
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded-md shadow-sm text-sm"
          >
            <option value="">Select Status</option>
            <option value="Picked Up">Picked Up</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition text-sm disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </button>
      </form>
    </div>
  );
};

export default UpdateStatus;
