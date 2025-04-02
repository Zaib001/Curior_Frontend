import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { getOrders } from '../../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to fetch orders. Please try again later.');
      }
    };

    fetchOrders();
  }, []);

  // Columns for DataTable
  const columns = [
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'Address', accessor: 'shippingAddress' },
    { header: 'Items', cell: (row) => `${row.items?.length || 0} item(s)` },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Orders</h2>
      
      <DataTable
        title="Orders"
        columns={columns}
        data={orders}
        onRowClick={setSelectedOrder}
      />

      {/* Modal for Order Details */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order: ${selectedOrder?.orderId}`}
      >
        {selectedOrder && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
            <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <div>
              <strong>Items:</strong>
              <ul className="list-disc pl-5">
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>{item.name || item.title || 'Item'}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
