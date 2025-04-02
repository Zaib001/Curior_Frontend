import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, FileText, Truck, Target, BadgeCent, Users, ChartBar, LogOut, Menu, X, Loader
} from 'lucide-react';
import Header from './Navbar';

// Dummy user role for testing. You can get it from API or localStorage.
const getUserRole = () => {
  return localStorage.getItem('role') || 'merchant';
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Links based on role
  const linksByRole = {
    merchant: [
      { path: '/merchant/dashboard', name: 'Dashboard', icon: <Home /> },
      { path: '/merchant/orders', name: 'Orders', icon: <FileText /> },
      { path: '/merchant/parcels', name: 'Parcels', icon: <Truck /> },
      { path: '/merchant/pickups', name: 'Pickup Requests', icon: <Target /> },
      { path: '/merchant/createparcel', name: 'Create Parcels', icon: <Truck /> },
      { path: '/merchant/create-order', name: 'Create Orders', icon: <Truck /> },
      { path: '/merchant/labels', name: 'Shipping Labels', icon: <BadgeCent /> },
    ],
    driver: [
      { path: '/driver/dashboard', name: 'Dashboard', icon: <Home /> },
      { path: '/driver/assigned', name: 'Assigned Parcels', icon: <Truck /> },
      { path: '/driver/status', name: 'Update Status', icon: <FileText /> },
      { path: '/driver/scanner', name: 'QR Scanner', icon: <Target /> },
    ],
    hub_staff: [
      { path: '/hub/dashboard', name: 'Dashboard', icon: <Home /> },
      { path: '/hub/status-overview', name: 'Status Overview', icon: <ChartBar /> },
    ],
    admin: [
      { path: '/admin/dashboard', name: 'Dashboard', icon: <Home /> },
      { path: '/admin/users', name: 'Users', icon: <Users /> },
      { path: '/admin/assigndriver', name: 'Assign Driver', icon: <Users /> },
      { path: '/admin/all-orders', name: 'All Orders', icon: <FileText /> },
      { path: '/admin/all-parcels', name: 'All Parcels', icon: <Truck /> },
      { path: '/admin/reports', name: 'Reports', icon: <ChartBar /> },
    ],
  };

  const links = linksByRole[role] || [];

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isOpen ? '240px' : '80px' }}
        className="h-screen bg-white shadow-md p-5 pt-8 relative transition-all duration-300"
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 bottom-9 bg-[#009688] text-white p-2 rounded-full"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-[#009688] text-white p-2 rounded-md">
            <Loader size={24} />
          </div>
          {isOpen && <h1 className="text-xl font-bold text-[#009688]">CourierSys</h1>}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive ? 'bg-[#009688] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <div className="text-lg">{link.icon}</div>
              {isOpen && <span className="text-md font-medium">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t my-6" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-md text-red-500 transition hover:bg-red-100 w-full"
        >
          <LogOut />
          {isOpen && <span className="text-md font-medium">Logout</span>}
        </button>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 overflow-auto">
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
