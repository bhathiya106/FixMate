import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { backendUrl, setIsLoggedin, setUserData } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [supplyOrders, setSupplyOrders] = useState([]);
  const [supplyOrdersLoading, setSupplyOrdersLoading] = useState(false);
  const [editOrderModal, setEditOrderModal] = useState({ open: false, order: null, type: null });
  const [generatingReport, setGeneratingReport] = useState(false);
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate CSV report for previous orders
  const generateOrdersReport = () => {
    setGeneratingReport(true);
    try {
      // Create CSV content
      let csvContent = [
        ['ORDER HISTORY REPORT'],
        ['Generated Date:', new Date().toLocaleDateString()],
        ['User:', user?.name || 'N/A'],
        ['Email:', user?.email || 'N/A'],
        [''],
        ['SERVICE ORDERS'],
        [
          'Order ID',
          'Service Provider',
          'Date',
          'Status',
          'Address',
          'Notes'
        ]
      ];

      // Add service orders
      orders
        .filter(o => o.status === 'done' || o.status === 'rejected')
        .forEach(order => {
          csvContent.push([
            order._id,
            order.vendorName,
            order.date,
            order.status,
            order.address,
            order.notes || ''
          ]);
        });

      // Add separator and supply orders header
      csvContent.push(
        [''],
        ['SUPPLY ORDERS'],
        [
          'Order ID',
          'Product Name',
          'Supplier',
          'Date',
          'Status',
          'Amount',
          'Payment Method',
          'Address',
          'Notes'
        ]
      );

      // Add supply orders
      supplyOrders
        .filter(o => o.status === 'Confirmed')
        .forEach(order => {
          csvContent.push([
            order._id,
            order.productName,
            order.supplierId?.name || 'N/A',
            order.date ? new Date(order.date).toLocaleDateString() : 'N/A',
            order.status,
            order.amount || 1,
            order.paymentMethod || 'N/A',
            order.address,
            order.notes || ''
          ]);
        });

      // Convert to CSV string
      const csv = csvContent.map(row => 
        row.map(cell => {
          const value = cell?.toString() || '';
          return value.includes(',') || value.includes('"') || value.includes('\n') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      ).join('\n');

      // Download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-history-${user?.name || 'user'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };
  
  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + '/api/auth/logout', {}, { withCredentials: true });
      setIsLoggedin(false);
      setUserData(null);
      navigate('/');
    } catch {
      //  error
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/user/data', { withCredentials: true });
        if (data.success) setUser(data.userData);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error(err.response.data.message || 'Session expired. Please log in again.');
          setIsLoggedin(false);
          setUserData(null);
          navigate('/login');
        } else {
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [backendUrl, setIsLoggedin, setUserData, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id && !user?.id) return;
      setOrdersLoading(true);
      try {
        const userId = user._id || user.id;
        const { data } = await axios.get(`${backendUrl.replace(/\/api.*/, '')}/api/orders/user/${userId}`, { withCredentials: true });
        if (data.success) setOrders(data.orders);
        else setOrders([]);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    const fetchSupplyOrders = async () => {
      if (!user?._id && !user?.id) return;
      setSupplyOrdersLoading(true);
      try {
        const userId = user._id || user.id;
        const { data } = await axios.get(`${backendUrl.replace(/\/api.*/, '')}/api/supply-orders/user/${userId}`, { withCredentials: true });
        if (data.success) setSupplyOrders(data.orders);
        else setSupplyOrders([]);
      } catch {
        setSupplyOrders([]);
      } finally {
        setSupplyOrdersLoading(false);
      }
    };
    if (user) {
      fetchOrders();
      fetchSupplyOrders();
    }
  }, [user, backendUrl]);

  // Delete order handler
  const handleDeleteOrder = async (orderId, type = 'service') => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      if (type === 'service') {
        await axios.delete(`${backendUrl.replace(/\/api.*/, '')}/api/orders/${orderId}`, { withCredentials: true });
        setOrders(prev => prev.filter(o => o._id !== orderId));
        toast.success('Order deleted');
      } else {
        await axios.delete(`${backendUrl.replace(/\/api.*/, '')}/api/supply-orders/${orderId}`, { withCredentials: true });
        setSupplyOrders(prev => prev.filter(o => o._id !== orderId));
        toast.success('Supply order deleted');
      }
    } catch {
      toast.error('Failed to delete order');
    }
  };

  // Save edited order handler
  const handleSaveEditOrder = async (updatedOrder) => {
    try {
      if (editOrderModal.type === 'service') {
        // Use /api/orders/:id for update
        await axios.put(`${backendUrl.replace(/\/api.*/, '')}/api/orders/${updatedOrder._id}`, updatedOrder, { withCredentials: true });
        setOrders(prev => prev.map(o => o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o));
        toast.success('Order updated');
      } else {
        // Use /api/supply-orders/:id for update
        await axios.put(`${backendUrl.replace(/\/api.*/, '')}/api/supply-orders/${updatedOrder._id}`, updatedOrder, { withCredentials: true });
        setSupplyOrders(prev => prev.map(o => o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o));
        toast.success('Supply order updated');
      }
      setEditOrderModal({ open: false, order: null, type: null });
    } catch {
      toast.error('Failed to update order');
    }
  };

  // Modal component for editing order
  const EditOrderModal = ({ open, order, type, onClose, onSave }) => {
    const [form, setForm] = useState(order || {});
    useEffect(() => { setForm(order || {}); }, [order]);
    if (!open || !order) return null;
    // Fields: for service: address, notes, date; for supply: address, notes, amount, paymentMethod, date
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
          <h2 className="text-xl font-bold mb-4">Edit {type === 'service' ? 'Service' : 'Supply'} Order</h2>
          <form onSubmit={e => { e.preventDefault(); onSave({ ...form }); }} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <input type="text" className="w-full p-2 border rounded bg-gray-100" value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Notes</label>
              <textarea className="w-full p-2 border rounded bg-gray-100" value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full p-2 border rounded bg-gray-100" value={form.date ? new Date(form.date).toISOString().slice(0,10) : ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            {type === 'supply' && (
              <div>
                <label className="block text-gray-700 mb-1">Amount</label>
                <input type="number" min="1" className="w-full p-2 border rounded bg-gray-100" value={form.amount || 1} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">Save</button>
              <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col gap-4 min-h-full">
        <div className="mb-8">
          {user?.profileImageUrl ? (
            <img
              src={
                user.profileImageUrl.startsWith('http')
                  ? user.profileImageUrl
                  : backendUrl.replace(/\/api.*/, '') + user.profileImageUrl
              }
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-blue-600"
            />
          ) : (
            <div className="rounded-full bg-blue-600 w-16 h-16 flex items-center justify-center text-3xl text-white font-bold mx-auto mb-2">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          )}
          <div className="text-center mt-2 font-semibold text-lg">{user?.name || 'User Name'}</div>
          <div className="text-center text-gray-500 text-sm">{user?.email || 'user@email.com'}</div>
        </div>
        <button
          className={`text-left px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab('orders')}
        >
          View Service Orders
        </button>
        <button
          className={`text-left px-4 py-2 rounded ${activeTab === 'supplyorders' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab('supplyorders')}
        >
          View Supply Orders
        </button>
        <button
          className={`text-left px-4 py-2 rounded ${activeTab === 'previous' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab('previous')}
        >
          Previous Orders
        </button>
        <div className="flex-1" />
        <button
          className={`text-left px-4 py-2 rounded ${activeTab === 'edit' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit Profile
        </button>
        <button
          className="text-left px-4 py-2 rounded hover:bg-red-100 text-red-700 font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-10">
        {activeTab === 'edit' ? (
          <EditProfileForm user={user} setUser={setUser} setActiveTab={setActiveTab} backendUrl={backendUrl} />
        ) : activeTab === 'orders' ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Current Service Orders</h2>
            {ordersLoading ? (
              <div className="text-gray-400">Loading orders...</div>
            ) : (
              <>
                {orders.filter(o => o.status === 'pending' || o.status === 'ongoing').length === 0 ? (
                  <div className="text-gray-500">No orders to show.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.filter(o => o.status === 'pending' || o.status === 'ongoing').map(order => (
                      <div key={order._id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">{order.vendorName}</div>
                          <div className="text-gray-600 text-sm">Date: {order.date}</div>
                          <div className="text-gray-600 text-sm">Status: <span className="capitalize font-medium">{order.status}</span></div>
                          {order.notes && <div className="text-gray-500 text-xs mt-1">Notes: {order.notes}</div>}
                        </div>
                        <div className="mt-2 md:mt-0 text-right flex flex-col gap-2 items-end">
                          <div className="text-gray-700 text-sm">Address: {order.address}</div>
                          <div className="flex gap-2 mt-2">
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs" onClick={() => setEditOrderModal({ open: true, order, type: 'service' })}>Edit</button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs" onClick={() => handleDeleteOrder(order._id, 'service')}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : activeTab === 'supplyorders' ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Current Supply Orders</h2>
            {supplyOrdersLoading ? (
              <div className="text-gray-400">Loading supply orders...</div>
            ) : (
              <>
                {supplyOrders.filter(o => o.status === 'Pending').length === 0 ? (
                  <div className="text-gray-500">No supply orders to show.</div>
                ) : (
                  <div className="space-y-4">
                    {supplyOrders.filter(o => o.status === 'Pending').map(order => (
                      <div key={order._id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">{order.productName}</div>
                          <div className="text-gray-600 text-sm">Supplier: {order.supplierId?.name || ''}</div>
                          <div className="text-gray-600 text-sm">Date: {order.date ? new Date(order.date).toLocaleDateString() : ''}</div>
                          <div className="text-gray-600 text-sm">Status: <span className="capitalize font-medium">{order.status}</span></div>
                          {order.notes && <div className="text-gray-500 text-xs mt-1">Notes: {order.notes}</div>}
                        </div>
                        <div className="mt-2 md:mt-0 text-right flex flex-col gap-2 items-end">
                          <div className="text-gray-700 text-sm">Address: {order.address}</div>
                          <div className="text-gray-700 text-sm">Amount: {order.amount || 1}</div>
                          <div className="text-gray-700 text-sm">Payment: {order.paymentMethod}</div>
                          <div className="flex gap-2 mt-2">
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs" onClick={() => setEditOrderModal({ open: true, order, type: 'supply' })}>Edit</button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs" onClick={() => handleDeleteOrder(order._id, 'supply')}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : activeTab === 'previous' ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Previous Orders</h2>
              <button
                onClick={generateOrdersReport}
                disabled={generatingReport || (orders.length === 0 && supplyOrders.length === 0)}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  generatingReport || (orders.length === 0 && supplyOrders.length === 0)
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {generatingReport ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to CSV
                  </>
                )}
              </button>
            </div>
            {ordersLoading && supplyOrdersLoading ? (
              <div className="text-gray-400">Loading orders...</div>
            ) : (
              <>
                {orders.filter(o => o.status === 'done' || o.status === 'rejected').length === 0 &&
                 supplyOrders.filter(o => o.status === 'Confirmed').length === 0 ? (
                  <div className="text-gray-500">No previous orders to show.</div>
                ) : (
                  <div className="space-y-4">
                    {/* Previous Service Orders */}
                    {orders.filter(o => o.status === 'done' || o.status === 'rejected').map(order => (
                      <div key={order._id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">{order.vendorName}</div>
                          <div className="text-gray-600 text-sm">Date: {order.date}</div>
                          <div className="text-gray-600 text-sm">Status: <span className="capitalize font-medium">{order.status}</span></div>
                          {order.notes && <div className="text-gray-500 text-xs mt-1">Notes: {order.notes}</div>}
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <div className="text-gray-700 text-sm">Address: {order.address}</div>
                        </div>
                      </div>
                    ))}
                    {/* Previous Supply Orders (Confirmed) */}
                    {supplyOrders.filter(o => o.status === 'Confirmed').map(order => (
                      <div key={order._id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">{order.productName}</div>
                          <div className="text-gray-600 text-sm">Supplier: {order.supplierId?.name || ''}</div>
                          <div className="text-gray-600 text-sm">Date: {order.date ? new Date(order.date).toLocaleDateString() : ''}</div>
                          <div className="text-gray-600 text-sm">Status: <span className="capitalize font-medium">{order.status}</span></div>
                          {order.notes && <div className="text-gray-500 text-xs mt-1">Notes: {order.notes}</div>}
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <div className="text-gray-700 text-sm">Address: {order.address}</div>
                          <div className="text-gray-700 text-sm">Amount: {order.amount || 1}</div>
                          <div className="text-gray-700 text-sm">Payment: {order.paymentMethod}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    {/* Edit Order Modal */}
    <EditOrderModal
      open={editOrderModal.open}
      order={editOrderModal.order}
      type={editOrderModal.type}
      onClose={() => setEditOrderModal({ open: false, order: null, type: null })}
      onSave={handleSaveEditOrder}
    />
  </div>
  );
};

// Edit Profile Form Component
function EditProfileForm({ user, setUser, setActiveTab, backendUrl }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthday: user?.birthday || '',
    profileImageUrl: user?.profileImageUrl || '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.profileImageUrl
      ? user.profileImageUrl.startsWith('http')
        ? user.profileImageUrl
        : backendUrl.replace(/\/api.*/, '') + user.profileImageUrl
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthday: user?.birthday || '',
      profileImageUrl: user?.profileImageUrl || '',
    });
    if (user?.profileImageUrl) {
      setProfileImagePreview(
        user.profileImageUrl.startsWith('http')
          ? user.profileImageUrl
          : backendUrl.replace(/\/api.*/, '') + user.profileImageUrl
      );
    } else {
      setProfileImagePreview(null);
    }
    setProfileImage(null);
  }, [user, backendUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('birthday', form.birthday);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      // Email is not editable, so not sent
      const { data } = await axios.put(
        backendUrl + '/api/user/update-profile',
        formData,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (data.success) {
        setUser((prev) => ({ ...prev, ...data.user }));
        setActiveTab('orders');
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form className="max-w-2xl w-full bg-white rounded-lg shadow p-8" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          {profileImagePreview ? (
            <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl text-blue-700 font-bold mb-2">
              {form.name ? form.name[0].toUpperCase() : 'U'}
            </div>
          )}
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer text-xs mt-2">
            Change Photo
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100"
            required
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold"
            onClick={() => setActiveTab('orders')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfile;
