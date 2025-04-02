import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://curior-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // This should be exact
  }
  return config;
});


// ✅ Error handler
const handleError = (error) => {
  console.error('API Error:', error.response?.data?.message || error.message);
  throw error;
};

// Create Parcel API
export const createParcel = async (parcelData) => {
  try {
    const response = await apiClient.post('/parcels', parcelData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const getOrders = async () => {
  try {
    const response = await apiClient.get('/merchant/orders');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Generate Label API
export const generateLabel = async (parcelId) => {
  try {
    const response = await apiClient.get(`/parcels/${parcelId}/label`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `label-${parcelId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    handleError(error);
  }
};

export const getParcels = async () => {
  try {
    const response = await apiClient.get('/merchant/parcels');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Export CSV API
export const exportParcelsCSV = async () => {
  try {
    const response = await apiClient.get('/merchant/parcels/export-csv', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'M25_Parcels.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    handleError(error);
  }
};

export const createPickupRequest = async (data) => {
  try {
    const response = await apiClient.post('/merchant/pickups', data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get Pickup Requests API
export const getPickupRequests = async () => {
  try {
    const response = await apiClient.get('/merchant/pickups');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/merchant/orders', orderData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
