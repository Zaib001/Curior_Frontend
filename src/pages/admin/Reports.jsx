import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  getRevenueReport,
  getStatusReport,
  getDeliveryTimeReport,
  getMonthlyRevenueReport,
  getTopMerchants,
  getParcelStatusTrends,
  getRevenueReportByDate,
  getStatusReportByDate,
  exportRevenueReportCSV,
  exportParcelStatusCSV,
} from '../../services/adminService';

const Reports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [deliveryTimeData, setDeliveryTimeData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [topMerchants, setTopMerchants] = useState([]);
  const [parcelTrends, setParcelTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          revenueResponse,
          statusResponse,
          deliveryResponse,
          monthlyRevenueResponse,
          merchantsResponse,
          trendsResponse,
        ] = await Promise.all([
          getRevenueReport(),
          getStatusReport(),
          getDeliveryTimeReport(),
          getMonthlyRevenueReport(),
          getTopMerchants(),
          getParcelStatusTrends(),
        ]);

        setRevenueData(revenueResponse || []);
        setOrderData(statusResponse || []);
        setDeliveryTimeData(deliveryResponse || []);
        setMonthlyRevenueData(monthlyRevenueResponse || []);
        setTopMerchants(merchantsResponse || []);
        setParcelTrends(trendsResponse || []);
      } catch (err) {
        console.error('Report Load Error:', err);
        setError('Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateFilter = async () => {
    try {
      const revenue = await getRevenueReportByDate(startDate, endDate);
      const status = await getStatusReportByDate(startDate, endDate);
      setRevenueData(revenue);
      setOrderData(status);
    } catch (err) {
      console.error('Date Filter Error:', err);
      setError('Failed to filter by date.');
    }
  };

  const formatData = (data, key) => data?.map((item) => item[key]);

  if (loading) return <div className="text-center text-gray-500">Loading reports...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold text-primary">Reports & Analytics</h2>

      {/* Filters and Export */}
      <div className="flex flex-wrap gap-4 items-center">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-4 py-2 rounded-md" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-4 py-2 rounded-md" />
        <button onClick={handleDateFilter} className="bg-primary text-white px-4 py-2 rounded-md">Apply</button>
        <button onClick={exportRevenueReportCSV} className="bg-green-600 text-white px-4 py-2 rounded-md">Revenue CSV</button>
        <button onClick={exportParcelStatusCSV} className="bg-blue-600 text-white px-4 py-2 rounded-md">Status CSV</button>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="font-semibold mb-3">📈 Monthly Revenue</h3>
          <LineChart
            height={300}
            xAxis={[{ data: formatData(monthlyRevenueData, 'month') }]}
            series={[{ data: formatData(monthlyRevenueData, 'revenue'), label: 'Revenue ($)' }]}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="font-semibold mb-3">📦 Order Status Overview</h3>
          <PieChart
            series={[{
              data: orderData.map((s, i) => ({ id: i, value: s.count, label: s.label })),
              innerRadius: 30,
              outerRadius: 100,
            }]}
            width={400}
            height={300}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="font-semibold mb-3">⏱ Avg Delivery Time</h3>
          <BarChart
            height={300}
            series={[{ data: formatData(deliveryTimeData, 'averageDeliveryTime'), label: 'Hours' }]}
            xAxis={[{ scaleType: 'band', data: formatData(deliveryTimeData, 'day') }]}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="font-semibold mb-3">🏆 Top Merchants by Revenue</h3>
          <BarChart
            height={300}
            series={[{ data: formatData(topMerchants, 'totalRevenue'), label: 'Revenue ($)' }]}
            xAxis={[{ scaleType: 'band', data: formatData(topMerchants, 'name') }]}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-card">
        <h3 className="font-semibold mb-3">📊 Parcel Status Trends</h3>
        <LineChart
          height={300}
          xAxis={[{ data: formatData(parcelTrends, 'day') }]}
          series={[{ data: formatData(parcelTrends, 'count'), label: 'Parcels' }]}
        />
      </div>
    </div>
  );
};

export default Reports;
