// src/pages/merchant/CreateOrder.jsx
import React, { useState } from 'react';
import { createOrder } from '../../services/api'; // Make sure this API exists
import toast, { Toaster } from 'react-hot-toast';

const CreateOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1 }]);
  const [error, setError] = useState('');

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => setItems([...items, { name: '', quantity: 1 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!orderId || !customerName || !shippingAddress || items.some(item => !item.name || item.quantity <= 0)) {
      setError('Please fill all fields and ensure items are valid.');
      return;
    }

    const newOrder = { orderId, customerName, shippingAddress, items };

    try {
      await createOrder(newOrder);
      toast.success('Order created successfully!');
      setOrderId('');
      setCustomerName('');
      setShippingAddress('');
      setItems([{ name: '', quantity: 1 }]);
      setError('');
    } catch (err) {
      toast.error('Failed to create order.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-primary mb-6">Create New Order</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Shipping Address</label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                min={1}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                className="w-24 px-3 py-2 border rounded-md"
              />
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:underline text-xs"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addItem}
            className="mt-2 text-sm text-primary hover:underline"
          >
            ➕ Add Item
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition"
      >
        Create Order
      </button>
    </div>
  );
};

export default CreateOrder;
