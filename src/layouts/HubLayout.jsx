// src/layouts/HubLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const HubLayout = () => {
  return <Sidebar>{/* Optional: Role check */} <Outlet /> </Sidebar>;
};

export default HubLayout;
