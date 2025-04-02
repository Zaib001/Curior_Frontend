import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { getParcels } from '../../services/adminService';

const AllParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const parcelsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await getParcels();
        setParcels(response.data); // ✅ Fix here
      } catch (error) {
        console.error('Error fetching parcels:', error);
        setError('Failed to fetch parcels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading parcels...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const filteredParcels = parcels.filter((parcel) =>
    (!filter || parcel.currentStatus === filter) &&
    (!search ||
      parcel.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      parcel.receiver.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedParcels = [...filteredParcels].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedParcels.length / parcelsPerPage);
  const startIndex = (currentPage - 1) * parcelsPerPage;
  const paginatedParcels = sortedParcels.slice(startIndex, startIndex + parcelsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getBadge = (status) => {
    switch (status) {
      case 'At Hub': return 'bg-blue-100 text-blue-700';
      case 'Dispatched': return 'bg-green-100 text-green-700';
      case 'Delivered': return 'bg-purple-100 text-purple-700';
      case 'Returned': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const columns = [
    { header: 'Parcel ID', accessor: '_id' },
    { header: 'Tracking ID', accessor: 'trackingId' },
    { header: 'Receiver', accessor: 'receiver' },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadge(row.currentStatus)}`}>
          {row.currentStatus}
        </span>
      ),
      onClickHeader: () => handleSort('currentStatus'),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-primary">All Parcels & Orders</h2>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Tracking ID or Receiver"
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
          <option value="Created">Created</option>
          <option value="At Hub">At Hub</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      <DataTable title="All Parcels" columns={columns} data={paginatedParcels} />

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

export default AllParcels;
