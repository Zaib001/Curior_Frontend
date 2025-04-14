import axios from 'axios';

const API_URL = 'https://curior-backend.onrender.com/api/driver';

// Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleError = (error) => {
  console.error('API Error:', error?.response?.data?.message || error.message);
  throw error;
};

// ✅ Fetch Assigned Parcels
export const getAssignedParcels = async () => {
  try {
    const response = await apiClient.get('/assigned');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Get Real-Time Location
export const getRealTimeLocation = async (parcelId) => {
  try {
    const response = await apiClient.get(`/real-time-location/${parcelId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

  
  // ✅ Export Data to CSV
  export const exportParcelsToCSV = (data) => {
    const csvData = data.map((parcel) => ({
      'Parcel ID': parcel.id,
      'Tracking ID': parcel.trackingId,
      Receiver: parcel.receiver,
      Address: parcel.address,
      Status: parcel.status,
    }));
  
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'assigned_parcels.csv');
    document.body.appendChild(link);
    link.click();
  };

  export const getDriverParcels = async () => {
    try {
      const res = await apiClient.get('/parcels');
      return res.data;
    } catch (error) {
      handleError(error);
    }
  };
  
  // ✅ Update parcel status
  export const updateParcelStatus = async (id, status) => {
    try {
      const res = await apiClient.patch(`/parcels/${id}/status`, { status });
      return res.data;
    } catch (error) {
      handleError(error);
    }
  };
  
  // ✅ Update parcel location
  export const updateParcelLocation = async (id, location) => {
    try {
      const res = await apiClient.patch(`/parcels/${id}/location`, location);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  };
  
  // ✅ Public parcel tracking info
  export const getTrackingInfo = async (trackingId) => {
    try {
      const res = await apiClient.get(`/track/${trackingId}`);
      return res.data;
    } catch (error) {
      console.log(error)
      handleError(error);
    }
  };
  export const optimizeRoute = async (parcels) => {
    const res = await fetch('https://curior-backend.onrender.com/api/driver/optimize-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ parcels }),
    });
  
    if (!res.ok) throw new Error('Failed to optimize route');
    return res.json();
  };
  