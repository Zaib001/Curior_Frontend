import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { getAllOrders } from '../../services/adminService';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        setOrders(Array.isArray(response.data) ? response.data : []); // ✅ Fix: extract "data" array
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Filter and search logic
  const filteredOrders = orders.filter((order) =>
    (!filter || order.status === filter) &&
    (!search || order.customerName.toLowerCase().includes(search.toLowerCase()) || order.orderId.includes(search))
  );

  // Sorting logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + ordersPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const columns = [
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Customer Name', accessor: 'customerName' },
    {
      header: 'Amount',
      cell: (row) => `$${(row.amount || 0).toFixed(2)}`,
      onClickHeader: () => handleSort('amount'),
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadge(row.status)}`}>
          {row.status}
        </span>
      ),
      onClickHeader: () => handleSort('status'),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-primary">All Orders</h2>

      {/* Filters and Search */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Orders"
        columns={columns}
        data={paginatedOrders}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllOrders;
