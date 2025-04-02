import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MerchantLayout from './layouts/MerchantLayout';
import DriverLayout from './layouts/DriverLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Merchant Pages
import MerchantDashboard from './pages/merchant/Dashboard';
import Orders from './pages/merchant/Orders';
import Parcels from './pages/merchant/Parcels';
import PickupRequests from './pages/merchant/PickupRequests';
import Labels from './pages/merchant/Labels';

// Driver Pages
import DriverDashboard from './pages/driver/Dashboard';
import AssignedParcels from './pages/driver/AssignedParcels';
import UpdateStatus from './pages/driver/UpdateStatus';
import QRScanner from './pages/driver/QRScanner';
// Hub pages
import HubLayout from './layouts/HubLayout';
import HubDashboard from './pages/hub/Dashboard';
import StatusOverview from './pages/hub/StatusOverview';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AllOrders from './pages/admin/AllOrders';
import AllParcels from './pages/admin/AllParcels';
import Reports from './pages/admin/Reports';
import CreateParcel from './pages/merchant/CreateParcel';
import CreateOrder from './pages/merchant/createOrder';
import AssignDriver from './pages/admin/AssignDriver';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Merchant Routes */}
        <Route path="/merchant" element={<MerchantLayout />}>
          <Route path="dashboard" element={<MerchantDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="parcels" element={<Parcels />} />
          <Route path="createparcel" element={<CreateParcel />} />
          <Route path="create-order" element={<CreateOrder />} />

          <Route path="pickups" element={<PickupRequests />} />
          <Route path="labels" element={<Labels />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="assigned" element={<AssignedParcels />} />
          <Route path="status" element={<UpdateStatus />} />
          <Route path="scanner" element={<QRScanner />} />
        </Route>
        {/* hub routes */}
        <Route path="/hub" element={<HubLayout />}>
          <Route path="dashboard" element={<HubDashboard />} />
          <Route path="status-overview" element={<StatusOverview />} />
        </Route>


        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="all-parcels" element={<AllParcels />} />
          <Route path="users" element={<Users />} />
          <Route path="assigndriver" element={<AssignDriver />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<h1 className="text-center mt-20 text-xl">404 – Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
