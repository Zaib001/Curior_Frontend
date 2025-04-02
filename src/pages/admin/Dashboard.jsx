import React, { useEffect, useState } from 'react';
import { getUsers, getParcels, getAllOrders, getTopMerchants } from '../../services/adminService';
import { BarChart, PieChart } from '@mui/x-charts';
import CountUp from 'react-countup';
import { CircularProgress } from '@mui/material';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalParcels, setTotalParcels] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalMerchants, setTotalMerchants] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const parcelsData = await getParcels();
        const ordersData = await getAllOrders();
        const merchantsData = await getTopMerchants();

        setTotalUsers(usersData.length);
        setTotalParcels(parcelsData.length);
        setTotalOrders(ordersData.length);
        setTotalMerchants(merchantsData.length);
        setRecentOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: 'Total Users', value: totalUsers },
    { label: 'Parcels in System', value: totalParcels },
    { label: 'Orders Synced', value: totalOrders },
    { label: 'Vendors Connected', value: totalMerchants },
  ];

  if (loading) {
    return <div className="text-center p-10 text-gray-500"><CircularProgress /></div>;
  }

  return (
    <div className=" p-6">
      <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>

      {/* ✅ Animated Summary Cards */}
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

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 shadow-card rounded-xl">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Parcel Distribution</h3>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['Users', 'Parcels', 'Orders', 'Vendors'] }]}
            series={[{ data: [totalUsers, totalParcels, totalOrders, totalMerchants] }]}
            width={400}
            height={300}
          />
        </div>
        <div className="bg-white p-5 shadow-card rounded-xl">
          <h3 className="text-md font-semibold mb-3 text-gray-700">Order Source Pie</h3>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: totalOrders, label: 'Orders' },
                  { id: 1, value: totalParcels, label: 'Parcels' },
                ],
              },
            ]}
            width={400}
            height={300}
          />
        </div>
      </div>

      {/* ✅ Recent Orders Table */}
      <div className="bg-white p-6 shadow-card rounded-xl">
        <h3 className="text-md font-semibold mb-4 text-gray-700">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{order.orderId}</td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">{order.items.length}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
