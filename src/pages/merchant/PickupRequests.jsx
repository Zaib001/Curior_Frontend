import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { createPickupRequest, getPickupRequests, getParcels } from '../../services/api';
import toast from 'react-hot-toast';

const PickupRequests = () => {
  const [formData, setFormData] = useState({
    parcelIds: [],
    pickupDate: '',
    pickupTime: '',
    address: '',
  });

  const [pickupList, setPickupList] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pickups = await getPickupRequests();
        const parcelRes = await getParcels();
        const data = Array.isArray(parcelRes) ? parcelRes : parcelRes.data || [];
        setPickupList(pickups);
        setParcels(data);
      } catch (error) {
        toast.error('Failed to load data.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    const ids = selectedOptions.map(opt => opt.value);
    setFormData(prev => ({ ...prev, parcelIds: ids }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.parcelIds.length === 0) {
      toast.error('Please select at least one parcel.');
      return;
    }
    try {
      await createPickupRequest(formData);
      toast.success('Pickup request submitted!');
      setFormData({ parcelIds: [], pickupDate: '', pickupTime: '', address: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      const updated = await getPickupRequests();
      setPickupList(updated);
    } catch {
      toast.error('Submission failed.');
    }
  };

  const parcelOptions = parcels.map(p => ({
    value: p._id,
    label: `${p.trackingId} - ${p.receiver}`,
  }));

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-card space-y-6">
        <h2 className="text-2xl font-semibold text-primary">Request a Pickup</h2>

        {submitted && (
          <div className="p-3 rounded-md bg-green-100 text-green-700 text-sm">
            ✅ Pickup request submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Multi Parcel Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Parcels</label>
            <Select
              isMulti
              options={parcelOptions}
              onChange={handleSelectChange}
              value={parcelOptions.filter(opt => formData.parcelIds.includes(opt.value))}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Date</label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md shadow-sm text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Time</label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md shadow-sm text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pickup Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Default or custom address"
              className="w-full border px-4 py-2 rounded-md shadow-sm text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition text-sm"
          >
            Submit Pickup Request
          </button>
        </form>
      </div>

      {/* Submitted Requests */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-semibold mb-4">Submitted Pickup Requests</h2>
        {pickupList.length === 0 ? (
          <p className="text-gray-500 text-sm">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-medium">Parcels</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Time</th>
                  <th className="p-3 text-left font-medium">Address</th>
                </tr>
              </thead>
              <tbody>
                {pickupList.map((req) => (
                  <tr key={req._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {Array.isArray(req.parcelIds)
                        ? req.parcelIds.join(', ')
                        : req.parcelId}
                    </td>
                    <td className="p-3">{req.pickupDate}</td>
                    <td className="p-3">{req.pickupTime}</td>
                    <td className="p-3">{req.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupRequests;
