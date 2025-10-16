import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveryDrivers = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteModal, setNoteModal] = useState({ open: false, driverId: '', name: '', message: '' });

  const authConfig = () => {
    const bearer = localStorage.getItem('admin_token');
    if (!bearer) {
      toast.error('Authentication required. Please log in again.');
      // Optional: Redirect to login page
      window.location.href = '/adminlogin';
      return null;
    }
    return { 
      withCredentials: true, 
      headers: { 
        'Authorization': `Bearer ${bearer}`,
        'Content-Type': 'application/json'
      } 
    };
  };

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const config = authConfig();
      if (!config) return;
      
      const { data } = await axios.get(`${backendUrl}/api/delivery/admin/all`, config);
      if (data.success) {
        setDrivers(data.deliveryDrivers || []);
      } else {
        setError(data.message || 'Failed to load drivers');
        toast.error(data.message || 'Failed to load drivers');
      }
    } catch (e) {
      console.error('Error fetching drivers:', e);
      const errorMessage = e.response?.data?.message || 'Failed to load drivers';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (e.response?.status === 403) {
        toast.error('Authentication failed. Please log in again.');
        localStorage.removeItem('admin_token');
        window.location.href = '/adminlogin';
      }
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  const confirmAction = async (message, action) => {
    if (!window.confirm(message)) return;
    await action();
  };

  const removeDriver = async (id) => {
    await confirmAction('Are you sure you want to remove this driver?', async () => {
      await axios.delete(`${backendUrl}/api/delivery/admin/${id}`, authConfig());
      toast.success('Driver removed');
      fetchDrivers();
    });
  };

  const banDriver = async (email) => {
    const reason = window.prompt('Enter a reason for ban (optional):') || '';
    await confirmAction(`Are you sure you want to ban ${email}? They will be blocked from login and registration.`, async () => {
      await axios.post(`${backendUrl}/api/delivery/admin/ban`, { email, reason }, authConfig());
      toast.success('Driver banned');
    });
  };

  const unbanDriver = async (email) => {
    await confirmAction(`Unban ${email}?`, async () => {
      await axios.post(`${backendUrl}/api/delivery/admin/unban`, { email }, authConfig());
      toast.success('Driver unbanned');
    });
  };

  const openNoteModal = (driver) => setNoteModal({ open: true, driverId: driver._id, name: driver.name, message: '' });
  const closeNoteModal = () => setNoteModal({ open: false, driverId: '', name: '', message: '' });

  const sendNote = async () => {
    if (!noteModal.message.trim()) return toast.warn('Message is required');
    await confirmAction(`Send note to ${noteModal.name}?`, async () => {
      await axios.post(`${backendUrl}/api/delivery/admin/notice`, { driverId: noteModal.driverId, message: noteModal.message }, authConfig());
      toast.success('Note sent');
      closeNoteModal();
    });
  };

  return (
    <main className="flex-1 p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Delivery Drivers</h1>
          <p className="text-gray-400">Manage drivers, send notes, ban/unban</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchDrivers} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-300">Loading drivers…</div>
      ) : error ? (
        <div className="bg-red-600 text-white p-3 rounded-lg">{error}</div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <table className="min-w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Area</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Rate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {drivers.map((d) => (
                <tr key={d._id} className="hover:bg-gray-700/40">
                  <td className="px-4 py-3 text-gray-200">{d.name}</td>
                  <td className="px-4 py-3 text-gray-200">{d.email}</td>
                  <td className="px-4 py-3 text-gray-200">{d.phone}</td>
                  <td className="px-4 py-3 text-gray-200">{d.operatingArea}</td>
                  <td className="px-4 py-3 text-gray-200">Rs. {d.rate}/delivery</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${d.isAvailable ? 'bg-green-600/20 text-green-300 border border-green-700' : 'bg-gray-600/20 text-gray-300 border border-gray-700'}`}>
                      {d.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openNoteModal(d)} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Send Note</button>
                      <button onClick={() => banDriver(d.email)} className="px-3 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white text-sm">Ban</button>
                      <button onClick={() => unbanDriver(d.email)} className="px-3 py-2 rounded-md bg-amber-700 hover:bg-amber-800 text-white text-sm">Unban</button>
                      <button onClick={() => removeDriver(d._id)} className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noteModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Send Note to {noteModal.name}</h2>
            <textarea
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Write your message here..."
              value={noteModal.message}
              onChange={(e) => setNoteModal({ ...noteModal, message: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeNoteModal} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white">Cancel</button>
              <button onClick={sendNote} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">Send</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DeliveryDrivers;
