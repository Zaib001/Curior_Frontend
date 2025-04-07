import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import {
  getParcels,
  deleteParcel,
  updateParcel,
  markParcelReturned
} from '../../services/adminService';
import toast from 'react-hot-toast';

const AllParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const res = await getParcels();
      setParcels(Array.isArray(res) ? res : res.data || []);
    } catch {
      toast.error('Failed to fetch parcels.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this parcel?')) return;
    try {
      await deleteParcel(id);
      toast.success('Parcel deleted');
      fetchParcels();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleMarkReturned = async (id) => {
    try {
      await markParcelReturned(id);
      toast.success('Parcel marked as returned');
      fetchParcels();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleEdit = (parcel) => {
    setSelectedParcel(parcel);
    setFormData({
      receiver: parcel.receiver,
      address: parcel.address,
      phone: parcel.phone,
      postcode: parcel.postcode,
      deliveryType: parcel.deliveryType,
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    try {
      await updateParcel(selectedParcel._id, formData);
      toast.success('Parcel updated');
      fetchParcels();
      setShowEditModal(false);
    } catch {
      toast.error('Update failed');
    }
  };

  const filteredParcels = parcels.filter((p) =>
    (!filter || p.currentStatus === filter) &&
    (!search || p.trackingId.toLowerCase().includes(search.toLowerCase()) || p.receiver.toLowerCase().includes(search.toLowerCase()))
  );

  const getBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium ';
    switch (status) {
      case 'Picked Up': return base + 'bg-blue-100 text-blue-700';
      case 'In Transit': return base + 'bg-yellow-100 text-yellow-700';
      case 'Delivered': return base + 'bg-green-100 text-green-700';
      case 'Returned': return base + 'bg-red-100 text-red-700';
      case 'Created': return base + 'bg-gray-100 text-gray-600';
      default: return base + 'bg-gray-200 text-gray-600';
    }
  };

  const columns = [
    { header: 'Tracking ID', accessor: 'trackingId' },
    { header: 'Receiver', accessor: 'receiver' },
    { header: 'Address', accessor: 'address' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Postcode', accessor: 'postcode' },
    { header: 'Delivery Type', accessor: 'deliveryType' },
    {
      header: 'Driver',
      cell: (row) =>
        row.driverId ? (
          <span>{row.driverId.name} ({row.driverId.email})</span>
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        ),
    },
    {
      header: 'Status',
      cell: (row) => <span className={getBadge(row.currentStatus)}>{row.currentStatus}</span>
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleMarkReturned(row._id)}
            className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
          >
            Mark Returned
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Parcel Management</h2>

      {/* Filters */}
      <div className="flex gap-4 items-center">
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
          <option value="Picked Up">Picked Up</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      <DataTable title="All Parcels" columns={columns} data={filteredParcels} />

      {/* Edit Parcel Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Parcel">
        <div className="space-y-4">
          <input
            type="text"
            name="receiver"
            value={formData.receiver}
            onChange={handleFormChange}
            placeholder="Receiver Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            placeholder="Address"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
            placeholder="Phone"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleFormChange}
            placeholder="Postcode"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="deliveryType"
            value={formData.deliveryType}
            onChange={handleFormChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Delivery Type --</option>
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
          </select>

          <button
            onClick={handleUpdateSubmit}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllParcels;
