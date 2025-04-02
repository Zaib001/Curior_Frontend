import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'merchant',
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err.message);
      alert('Failed to delete user.');
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || 'Registration failed');

      alert('✅ User registered successfully!');
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'merchant' });
      fetchUsers();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const filteredUsers = roleFilter
    ? users.filter((u) => u.role === roleFilter)
    : users;

  return (
    <div className=" p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">User Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
          >
            ➕ Add User
          </button>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="merchant">Merchant</option>
            <option value="driver">Driver</option>
            <option value="hub_staff">Hub Staff</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-card rounded-xl overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Email</th>
              <th className="p-3 text-left font-medium">Role</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role.replace('_', ' ')}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border px-4 py-2 rounded-md"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-md"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-md"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="w-full border px-4 py-2 rounded-md"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="merchant">Merchant</option>
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
            <option value="hub_staff">Hub Staff</option>
          </select>
          <button
            onClick={handleAddUser}
            className="w-full bg-primary text-white py-2 rounded-md"
          >
            Register User
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
