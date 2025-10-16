import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const handleLogout = async () => {
    try {
      // Clear local token used for Authorization header
      localStorage.removeItem('admin_token');
      // Invalidate server cookie
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      toast.success('Logged out');
      navigate('/');
    } catch (e) {
      console.error('Logout failed', e);
      // Proceed with client-side logout anyway
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/70 sticky top-0 z-10">
          <div className="text-sm text-gray-400">Admin Panel</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden sm:inline">Signed in as Admin</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
