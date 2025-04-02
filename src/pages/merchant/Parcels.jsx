import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { QRCodeCanvas } from 'qrcode.react';
import { getParcels, exportParcelsCSV } from '../../services/api';
import checkIfWithinM25 from '../../utils/checkM25';
import toast from 'react-hot-toast';

const Parcels = () => {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filter, setFilter] = useState('');
  const [filterM25, setFilterM25] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch Data from API
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await getParcels();
        console.log(data)
        const taggedParcels = data.map((parcel) => ({
          ...parcel,
          isWithinM25: checkIfWithinM25(parcel.postcode),
        }));
        setParcels(taggedParcels);
        setFilteredParcels(taggedParcels);
      } catch (error) {
        toast.error('Failed to fetch parcels. Please try again later.');
      }
    };
    fetchParcels();
  }, []);

  // Filter and Search
  useEffect(() => {
    const filtered = parcels.filter((p) => {
      const matchesSearch =
        search === '' ||
        p.trackingId.toLowerCase().includes(search.toLowerCase()) ||
        p.receiver.toLowerCase().includes(search.toLowerCase());
      const matchesM25 = !filterM25 || p.isWithinM25;
      return matchesSearch && matchesM25;
    });
    setFilteredParcels(filtered);
  }, [search, filterM25, parcels]);

  // Status Badge Styling
  const getBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium ';
    switch (status) {
      case 'In Transit':
        return base + 'bg-yellow-100 text-yellow-700';
      case 'Delivered':
        return base + 'bg-green-100 text-green-700';
      case 'Pending Pickup':
        return base + 'bg-blue-100 text-blue-700';
      default:
        return base + 'bg-gray-200 text-gray-600';
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    try {
      await exportParcelsCSV();
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV. Please try again.');
    }
  };

  // Table Columns
  const columns = [
    { header: 'Tracking ID', accessor: 'trackingId' },
    { header: 'Receiver', accessor: 'receiver' },
    { header: 'Address', accessor: 'address' },
    {
      header: 'M25 Zone',
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.isWithinM25 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {row.isWithinM25 ? 'Within M25' : 'Outside M25'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <span className={getBadge(row.currentStatus)}>{row.currentStatus}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Tracking ID or Receiver"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filterM25}
            onChange={(e) => setFilterM25(e.target.checked)}
          />
          <span>Show Only M25 Parcels</span>
        </label>
        <button
          onClick={handleExportCSV}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          📥 Export M25 Parcels
        </button>
      </div>

      {/* Parcel Table */}
      <DataTable title="Parcels" columns={columns} data={filteredParcels} onRowClick={setSelectedParcel} />

      {/* Parcel Details Modal */}
      <Modal isOpen={!!selectedParcel} onClose={() => setSelectedParcel(null)} title={`Parcel: ${selectedParcel?.trackingId}`}>
        {selectedParcel && (
          <div className="text-sm space-y-3 text-gray-700">
            <p><strong>Receiver:</strong> {selectedParcel.receiver}</p>
            <p><strong>Address:</strong> {selectedParcel.address}</p>
            <p><strong>Status:</strong> {selectedParcel.currentStatus}</p>
            <div className="mt-4">
              <strong>QR Code:</strong>
              <div className="mt-2 border p-3 w-fit bg-gray-50 rounded-md">
                <QRCodeCanvas value={selectedParcel.trackingId} size={128} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Parcels;
