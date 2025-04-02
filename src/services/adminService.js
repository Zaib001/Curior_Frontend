import axios from 'axios';

// Set Base URL
const API_URL = 'https://curior-backend.onrender.com/api/admin';

// Axios Instance Setup
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
 ✅ User Management APIs
=============================== */
export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/* ==============================
 ✅ Parcel Management APIs
=============================== */
export const getParcels = async () => {
  try {
    const response = await apiClient.get('/parcels');
    console.log('All parcel Response:', response.data); // 👈 Add this

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const assignDriver = async (parcelId, driverId) => {
  try {
    const response = await apiClient.put(`/${parcelId}/assign`, { driverId });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/* ==============================
 ✅ Order Management APIs
=============================== */
export const getAllOrders = async () => {
  const response = await apiClient.get('/orders');
  console.log('All Orders Response:', response.data); // 👈 Add this
  return response.data;
};


/* ==============================
 ✅ Reports APIs
=============================== */

// Fetch Revenue Report
export const getRevenueReport = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(`/reports/revenue?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch Status Report
export const getStatusReport = async () => {
  try {
    const response = await apiClient.get('/reports/status');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch Delivery Time Report
export const getDeliveryTimeReport = async () => {
  try {
    const response = await apiClient.get('/reports/delivery-time');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch Monthly Revenue Report
export const getMonthlyRevenueReport = async () => {
  try {
    const response = await apiClient.get('/reports/monthly-revenue');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch Top Merchants
export const getTopMerchants = async () => {
  try {
    const response = await apiClient.get('/reports/top-merchants');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch Parcel Status Trends
export const getParcelStatusTrends = async () => {
  try {
    const response = await apiClient.get('/reports/parcel-status-trends');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch Revenue Report by Date
export const getRevenueReportByDate = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(`/reports/revenue-date?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch Status Report by Date
export const getStatusReportByDate = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(`/reports/status-date?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Export Revenue Report as CSV
export const exportRevenueReportCSV = async () => {
  try {
    const response = await apiClient.get('/reports/revenue-csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'revenue-report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    handleError(error);
  }
};

// Export Status Report as CSV
export const exportParcelStatusCSV = async () => {
  try {
    const response = await apiClient.get('/reports/status-csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'parcel-status-report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    handleError(error);
  }
};

/* ==============================
 ✅ Real-Time Tracking API
=============================== */
export const getRealTimeLocation = async (parcelId) => {
  try {
    const response = await apiClient.get(`/real-time-location/${parcelId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/* ==============================
 ✅ Notifications API
=============================== */
export const sendNotification = async (data) => {
  try {
    const response = await apiClient.post('/send-notification', data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllParcels = async () => {
  const response = await apiClient.get('/parcels');
  return response.data;
};

export const getAllDrivers = async () => {
  const response = await apiClient.get('/drivers');
  return response.data;
};

export const assignDriverToParcel = async (parcelId, driverId) => {
  const response = await apiClient.put(`/parcels/${parcelId}/assign-driver`, { driverId });
  return response.data;
};
