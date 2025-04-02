import axios from 'axios';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
// Base URL for Merchant API
const API_URL = 'https://curior-backend.onrender.com/api/merchant';

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

// Handle API Errors
const handleError = (error) => {
  console.error('API Error:', error?.response?.data?.message || error.message);
  throw error;
};

/* ==============================
 ✅ Order Management APIs
=============================== */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const exportOrdersToCSV = async () => {
    try {
      const orders = await getOrders();
      const csv = Papa.unparse(orders);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'orders.csv');
    } catch (error) {
      handleError(error);
    }
  };
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const searchOrders = async (query) => {
  try {
    const response = await apiClient.get(`/orders/search?query=${query}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/* ==============================
 ✅ Pickup Request APIs
=============================== */
export const createPickupRequest = async (pickupData) => {
  try {
    const response = await apiClient.post('/pickups', pickupData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPickupRequests = async () => {
  try {
    const response = await apiClient.get('/pickups');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/* ==============================
 ✅ Notification API
=============================== */
export const sendNotification = async (notificationData) => {
  try {
    const response = await apiClient.post('/send-notification', notificationData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const trackParcel = async (trackingId) => {
    try {
      const response = await apiClient.get(`/track/${trackingId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };
  
  /* ==============================
   ✅ Analytics API
  =============================== */
  export const getAnalytics = async () => {
    try {
      const response = await apiClient.get('/analytics');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  export const getMerchantAnalytics = async () => {
    const response = await apiClient.get('/analytics');
    return response.data;
  };
  
  export const getMerchantParcels = async () => {
    const response = await apiClient.get('/parcels');
    console.log(response.data)
    return response.data;
  };
  
  export const getMerchantOrders = async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  };
  
  
  export const updateMerchantOrderStatus = async (orderId, status) => {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
  };
  