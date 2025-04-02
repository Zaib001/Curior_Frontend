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

  // Date Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch Data
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
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Failed to load reports data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Reports by Date Range
  const handleDateFilter = async () => {
    try {
      const revenue = await getRevenueReportByDate(startDate, endDate);
      const status = await getStatusReportByDate(startDate, endDate);
      setRevenueData(revenue);
      setOrderData(status);
    } catch (error) {
      console.error('Error fetching date range reports:', error);
      setError('Failed to fetch reports for the selected dates.');
    }
  };

  // Handle CSV Export
  const handleExportRevenueCSV = async () => {
    await exportRevenueReportCSV();
  };

  const handleExportStatusCSV = async () => {
    await exportParcelStatusCSV();
  };

  if (loading) return <div className="text-center text-gray-500">Loading reports...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Format Data for Charts
  const formatData = (data, key) => data?.map((item) => item[key]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary">Reports Overview</h2>

      {/* Date Filters */}
      <div className="flex gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <button onClick={handleDateFilter} className="bg-primary text-white px-4 py-2 rounded-md">
          Apply Date Range
        </button>
      </div>

      {/* CSV Export Buttons */}
      <div className="flex gap-4">
        <button onClick={handleExportRevenueCSV} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Export Revenue Report CSV
        </button>
        <button onClick={handleExportStatusCSV} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Export Status Report CSV
        </button>
      </div>

      {/* Monthly Revenue - Line Chart */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="font-semibold mb-4">Monthly Revenue Report</h3>
        <LineChart
          height={300}
          xAxis={[{ data: formatData(monthlyRevenueData, 'month') }]}
          series={[{ data: formatData(monthlyRevenueData, 'revenue'), label: 'Revenue ($)' }]}
        />
      </div>

      {/* Order Status - Pie Chart */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-card p-6">
          <h3 className="font-semibold mb-4">Order Status Overview</h3>
          <PieChart
            series={[{
              data: orderData.map((status, index) => ({
                id: index,
                value: status.count,
                label: status.label,
              })),
              innerRadius: 30,
              outerRadius: 100,
            }]}
            width={400}
            height={300}
          />
        </div>

        {/* Delivery Time Report - Bar Chart */}
        <div className="flex-1 bg-white rounded-xl shadow-card p-6">
          <h3 className="font-semibold mb-4">Average Delivery Time (Hours)</h3>
          <BarChart
            height={300}
            series={[{ data: formatData(deliveryTimeData, 'averageDeliveryTime'), label: 'Avg Delivery Time' }]}
            xAxis={[{ scaleType: 'band', data: formatData(deliveryTimeData, 'day') }]}
          />
        </div>
      </div>

      {/* Top Merchants - Bar Chart */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="font-semibold mb-4">Top Performing Merchants</h3>
        <BarChart
          height={300}
          series={[{ data: formatData(topMerchants, 'totalRevenue'), label: 'Revenue ($)' }]}
          xAxis={[{ scaleType: 'band', data: formatData(topMerchants, 'name') }]}
        />
      </div>

      {/* Parcel Status Trends - Line Chart */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="font-semibold mb-4">Parcel Status Trends</h3>
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
