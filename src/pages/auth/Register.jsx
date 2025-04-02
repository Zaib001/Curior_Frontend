import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'merchant' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await fetch('https://curior-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      // Safely check for JSON content
      const contentType = response.headers.get('content-type');
      const result = contentType && contentType.includes('application/json')
        ? await response.json()
        : null;
  
      if (!response.ok) {
        const errorMsg = result?.message || 'Registration failed';
        throw new Error(errorMsg);
      }
  
      alert('✅ Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error('Registration Error:', err.message);
      setError(err.message);
    }
  };
  
  
  

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl"
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-[#009688]">Register</h2>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#009688]"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#009688]"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#009688]"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#009688]"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="merchant">Merchant</option>
              <option value="admin">Admin</option>
              <option value="driver">Driver</option>
              <option value="hub_staff">Hub Staff</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#009688] text-white py-2 rounded-md hover:bg-[#00796B] transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-[#009688] hover:underline">Login</a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Register;
