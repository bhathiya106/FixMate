import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardMain = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSuppliers: 0,
    totalVendors: 0,
    totalDeliveryDrivers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    vendorRevenue: 0,
    supplierRevenue: 0,
    deliveryRevenue: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const navigate = useNavigate();

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const bearer = localStorage.getItem('admin_token');
      if (!bearer) {
        setError('Authentication required. Please log in again.');
        navigate('/adminlogin');
        return;
      }

      const config = {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${bearer}`,
          'Content-Type': 'application/json'
        }
      };

      // Fetch all statistics from different endpoints
      const [
        usersResponse,
        suppliersResponse,
        vendorsResponse,
        deliveryResponse,
        productsResponse,
        revenueResponse
      ] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/users/count`, config),
        axios.get(`${backendUrl}/api/admin/supplier/count`, config),
        axios.get(`${backendUrl}/api/admin/vendor/count`, config),
        axios.get(`${backendUrl}/api/admin/delivery/count`, config),
        axios.get(`${backendUrl}/api/admin/products/count`, config),
        axios.get(`${backendUrl}/api/admin/revenue`, config)
      ]);

      setStats({
        totalUsers: usersResponse.data.count || 0,
        totalSuppliers: suppliersResponse.data.count || 0,
        totalVendors: vendorsResponse.data.count || 0,
        totalDeliveryDrivers: deliveryResponse.data.count || 0,
        totalProducts: productsResponse.data.count || 0,
        totalRevenue: revenueResponse.data.totalRevenue || 0,
        vendorRevenue: revenueResponse.data.vendorRevenue || 0,
        supplierRevenue: revenueResponse.data.supplierRevenue || 0,
        deliveryRevenue: revenueResponse.data.deliveryRevenue || 0,
        recentActivity: revenueResponse.data.recentActivity || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response?.status === 403) {
        setError('Access denied. Please log in again with admin credentials.');
        navigate('/adminlogin');
      } else {
        setError(error.response?.data?.message || 'Failed to load dashboard statistics');
      }
      
      // Clear admin token if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('admin_token');
      }
    } finally {
      setLoading(false);
    }
  }, [backendUrl, navigate]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const exportCSV = () => {
    // Build a simple CSV with counts and revenue breakdown
    const lines = [];
    lines.push('Section,Metric,Value');
    lines.push(`Counts,Total Users,${stats.totalUsers}`);
    lines.push(`Counts,Total Suppliers,${stats.totalSuppliers}`);
    lines.push(`Counts,Total Vendors,${stats.totalVendors}`);
    lines.push(`Counts,Delivery Drivers,${stats.totalDeliveryDrivers}`);
    lines.push(`Counts,Total Products,${stats.totalProducts}`);
    lines.push('');
    lines.push('Revenue,Category,Amount');
    lines.push(`Revenue,Vendor Service Fees (20%),${stats.vendorRevenue.toFixed(2)}`);
    lines.push(`Revenue,Supplier Product Fees (20%),${stats.supplierRevenue.toFixed(2)}`);
    lines.push(`Revenue,Delivery Admin Commission (20% of 10%),${stats.deliveryRevenue.toFixed(2)}`);
    lines.push(`Revenue,Total Admin Revenue,${stats.totalRevenue.toFixed(2)}`);
    lines.push('');
    lines.push(`Generated At,${new Date().toISOString()}`);

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-revenue-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-100 text-sm font-medium">{title}</p>
          <p className="text-white text-3xl font-bold mt-2">
            {loading ? '...' : typeof value === 'string' ? value : value.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-gray-200 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-white text-4xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <main className="flex-1 p-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Overview of FIX MATE platform statistics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={fetchDashboardStats}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="from-blue-500 to-blue-600"
          subtitle="Registered customers"
        />
        
        <StatCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          icon="🏪"
          color="from-green-500 to-green-600"
          subtitle="Product suppliers"
        />
        
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
          icon="🔧"
          color="from-purple-500 to-purple-600"
          subtitle="Service providers"
        />
        
        <StatCard
          title="Delivery Drivers"
          value={stats.totalDeliveryDrivers}
          icon="🚚"
          color="from-orange-500 to-orange-600"
          subtitle="Active drivers"
        />
        
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          color="from-indigo-500 to-indigo-600"
          subtitle="Available products"
        />
        
        <StatCard
          title="Admin Revenue (20%)"
          value={`Rs. ${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
          color="from-yellow-500 to-yellow-600"
          subtitle="Platform commission"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Details */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Vendor Service Fees (20%)</span>
              <span className="text-green-400 font-semibold">
                Rs. {stats.vendorRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Supplier Product Fees (20%)</span>
              <span className="text-blue-400 font-semibold">
                Rs. {stats.supplierRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Delivery Admin Commission (20% of 10%)</span>
              <span className="text-orange-400 font-semibold">
                Rs. {stats.deliveryRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Admin Revenue</span>
                <span className="text-yellow-400 font-bold text-lg">
                  Rs. {stats.totalRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (aligned with Sidebar) */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin')} className="w-full bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-lg transition-colors text-left">📊 Dashboard</button>
            <button onClick={() => navigate('/admin/users')} className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors text-left">👥 Manage Users</button>
            <button onClick={() => navigate('/admin/vendors')} className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors text-left">🔧 Manage Vendors</button>
            <button onClick={() => navigate('/admin/suppliers')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors text-left">🏪 Manage Suppliers</button>
            <button onClick={() => navigate('/admin/products')} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition-colors text-left">📦 Manage Products</button>
            <button onClick={() => navigate('/admin/services')} className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-colors text-left">✉️ View Contact Messages</button>
          </div>
        </div>
      </div>

    </main>
  );
};

export default DashboardMain;
