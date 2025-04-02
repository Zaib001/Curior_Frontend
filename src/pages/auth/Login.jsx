import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await fetch('https://curior-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
  
      // Save token and role in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.user.role);
  
      // Redirect based on role
      switch (result.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'merchant':
          navigate('/merchant/dashboard');
          break;
        case 'driver':
          navigate('/driver/dashboard');
          break;
        case 'hub_staff':
          navigate('/hub/dashboard');
          break;
        default:
          navigate('/login');
      }
    } catch (error) {
      setError(error.message);
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
        <h2 className="text-3xl font-bold mb-6 text-[#009688]">Login</h2>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <button
            type="submit"
            className="w-full bg-[#009688] text-white py-2 rounded-md hover:bg-[#00796B] transition duration-300"
          >
            Login
          </button>
        </form>
       
      </motion.div>
    </motion.div>
  );
};

export default Login;
