import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, User, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const routeNames = {
    '/merchant/dashboard': 'Dashboard',
    '/merchant/orders': 'Orders',
    '/merchant/parcels': 'Parcels',
    '/merchant/pickups': 'Pickup Requests',
    '/merchant/labels': 'Shipping Labels',
    '/driver/assigned': 'Assigned Parcels',
    '/driver/status': 'Update Status',
    '/driver/scanner': 'QR Scanner',
    '/admin/users': 'User Management',
    '/admin/all-orders': 'All Orders',
    '/admin/all-parcels': 'All Parcels',
    '/admin/reports': 'Reports',
  };

  const currentRoute = routeNames[location.pathname] || 'Courier System';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 bg-white shadow"
    >
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-primary">{currentRoute}</h1>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <ChevronRight />
          <span>MERCHANT</span> {/* You can change this statically or dynamically later */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-gray-600 cursor-pointer" />
        <div className="flex items-center gap-2">
          <User className="text-gray-600" />
          <span className="text-md font-medium text-gray-700">Merchant</span>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
