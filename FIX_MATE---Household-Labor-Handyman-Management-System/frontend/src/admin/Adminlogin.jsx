import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Adminlogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/admin-login`,
        { username: form.username, password: form.password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        // Store token so dashboard requests can send Authorization header
        if (res.data.token) {
          localStorage.setItem('admin_token', res.data.token);
        }
        toast.success('Admin login successful');
        navigate('/admin');
      } else {
        toast.error(res.data?.message || 'Invalid admin credentials');
      }
    } catch (err) {
      console.error('Admin login failed', err);
      toast.error(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          FixMate Admin
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Admin Login
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter admin username"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Adminlogin;
