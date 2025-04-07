import React, { useEffect, useState } from 'react';
import { getParcels,getPickupRequests } from '../../services/adminService';
import CountUp from 'react-countup';
import { CircularProgress } from '@mui/material';

const AdminDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parcelRes = await getParcels();
        const pickupRes = await getPickupRequests();
        // Normalize parcel data
        const parcelData = Array.isArray(parcelRes) ? parcelRes : parcelRes.data || [];
        const pickupData = Array.isArray(pickupRes) ? pickupRes : pickupRes.data || [];

        setParcels(parcelData);
        setPickups(pickupData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const inTransit = parcels.filter(p => p.currentStatus === 'In Transit').length;
  const delivered = parcels.filter(p => p.currentStatus === 'Delivered').length;

  const stats = [
    { label: 'Total Parcels', value: parcels.length },
    { label: 'Parcels In Transit', value: inTransit },
    { label: 'Parcels Delivered', value: delivered },
    { label: 'Pickups Requested', value: pickups.length },
  ];

  if (loading) {
    return <div className="text-center p-10 text-gray-500"><CircularProgress /></div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 bg-white shadow-card rounded-xl text-center hover:shadow-lg transition">
            <div className="text-3xl font-bold text-primary">
              <CountUp end={stat.value} duration={1.5} />
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
