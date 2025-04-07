import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import { getOrders } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const Labels = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders.');
      }
    };
    fetchOrders();
  }, []);

  const toggleSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filtered = orders.filter((order) => selectedOrders.includes(order._id));

  const handlePrint = () => {
    if (filtered.length === 0) return toast.error('No orders selected to print!');
    setTimeout(() => {
      window.print();
    }, 100); // Small delay to render everything properly
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto print:bg-white print:p-0 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-primary">Shipping Labels</h1>
        {filtered.length > 0 && (
          <button
            onClick={handlePrint}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark text-sm"
          >
            🖨️ Print Labels
          </button>
        )}
      </div>

      {/* Order Selector */}
      <div className="bg-white p-6 rounded-xl shadow-card print:hidden">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Select Orders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {orders.map((order) => (
            <label
              key={order._id}
              className="flex items-center gap-3 bg-gray-50 border px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedOrders.includes(order._id)}
                onChange={() => toggleSelect(order._id)}
              />
              <div>
                <p className="font-medium text-sm">{order.orderId}</p>
                <p className="text-xs text-gray-500">{order.customerName}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-3">
        {filtered.map((order) => (
          <div
            key={order._id}
            className="p-5 rounded-lg border bg-white shadow-md print:shadow-none print:border print:p-4"
          >
            {/* Logo */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">CourierSys</h3>
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </div>

            {/* Address */}
            <div className="mb-4">
              <p className="text-sm text-gray-800"><strong>To:</strong> {order.customerName}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress}</p>
            </div>

            {/* QR & Barcode */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col items-center">
                {order.orderId && <QRCodeCanvas value={order.orderId} size={90} />}
                <span className="text-[10px] text-gray-500 mt-1">QR</span>
              </div>
              <div className="flex-1 text-right">
                {order.orderId && (
                  <Barcode
                    value={order.orderId}
                    height={40}
                    width={1.5}
                    displayValue={false}
                  />
                )}
                <span className="text-[10px] text-gray-500">Barcode</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-[11px] text-gray-500 border-t pt-2 flex justify-between">
              <p><strong>Tracking:</strong> {order.orderId}</p>
              <p><strong>ID:</strong> {order._id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Labels;
