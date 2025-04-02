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

// ✅ Optimize Route
export const optimizeRoute = async (parcelIds) => {
  try {
    const response = await apiClient.post('/optimize-route', { parcelIds });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Update Parcel Status
export const updateParcelStatus = async (parcelId, status) => {
  try {
    const response = await apiClient.put(`/${parcelId}/status`, { status });
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