import axios from 'axios';

// Set the Base URL for API Requests
const API_URL = 'https://curior-backend.onrender.com/api/hub';

// Create Axios Instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Token to API Requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error Handler
const handleError = (error) => {
  console.error('API Error:', error.response?.data?.message || error.message);
  throw error;
};

/* ==============================
 ✅ Hub Dashboard APIs
=============================== */

// ✅ Fetch Status Summary
export const getHubStatusSummary = async () => {
  try {
    const response = await apiClient.get('/status-summary');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Fetch Parcels by Status
export const getParcelsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`/parcels?status=${status}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Update Parcel Status (Mark At Hub)
export const markParcelAtHub = async (parcelId) => {
  try {
    const response = await apiClient.put(`/${parcelId}/at-hub`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Dispatch Parcel
export const dispatchParcel = async (parcelId) => {
  try {
    const response = await apiClient.put(`/${parcelId}/dispatch`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Mark Parcel as Returned
export const markParcelReturned = async (parcelId) => {
  try {
    const response = await apiClient.put(`/${parcelId}/return`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Real-Time Tracking
export const getRealTimeLocation = async (parcelId) => {
  try {
    const response = await apiClient.get(`/real-time-location/${parcelId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
// ✅ Add this function in hubService.js
export const updateParcelStatus = async (parcelId, status) => {
  try {
    const response = await apiClient.put(`/${parcelId}/status`, { status });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
