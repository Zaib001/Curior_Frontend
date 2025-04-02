import React, { useState } from 'react';
import checkIfWithinM25 from '../../utils/checkM25';
import { createParcel } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const CreateParcel = () => {
  const [trackingId, setTrackingId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!trackingId || !receiver || !address || !postcode) {
      setError('Please fill in all fields.');
      return;
    }

    // Check for M25 Area
    const isWithinM25 = checkIfWithinM25(postcode);
    const newParcel = {
      trackingId,
      receiver,
      address,
      postcode,
      isWithinM25,
    };

    try {
      console.log(newParcel)
      await createParcel(newParcel);
      toast.success('Parcel created successfully!');
      
      // Reset Form
      setTrackingId('');
      setReceiver('');
      setAddress('');
      setPostcode('');
      setError('');
    } catch (error) {
      toast.error('Failed to create parcel. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-primary mb-6">Create New Parcel</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tracking ID</label>
          <input
            type="text"
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Receiver Name</label>
          <input
            type="text"
            placeholder="Receiver's Full Name"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Postcode</label>
          <input
            type="text"
            placeholder="e.g. SE15 4AB"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition"
      >
        Create Parcel
      </button>

      {/* M25 Status Message */}
      {postcode && (
        <p className="mt-4 text-sm text-gray-600">
          {checkIfWithinM25(postcode) 
            ? '✅ This postcode is within the M25 area.' 
            : '❗ This postcode is outside the M25 area.'}
        </p>
      )}
    </div>
  );
};

export default CreateParcel;
