import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const VendorNotices = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);

  const fetchNotices = useCallback(async () => {
    try {
      setLoadingNotices(true);
      const { data } = await axios.get(backendUrl + '/api/vendor/notices', { withCredentials: true });
      if (data.success) setNotices(data.notices || []);
    } catch {
      // silent
    } finally {
      setLoadingNotices(false);
    }
  }, [backendUrl]);

  const markRead = useCallback(async (id) => {
    try {
      await axios.post(backendUrl + `/api/vendor/notices/${id}/read`, {}, { withCredentials: true });
      setNotices((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {
      // silent
    }
  }, [backendUrl]);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Admin Notices</h2>
        <button onClick={fetchNotices} className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Refresh</button>
      </div>
      {loadingNotices ? (
        <div className="text-gray-300">Loading notices…</div>
      ) : notices.length === 0 ? (
        <div className="text-gray-400">No notices</div>
      ) : (
        <ul className="space-y-3">
          {notices.map((n) => (
            <li key={n._id} className="p-3 bg-gray-900 rounded border border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-200 whitespace-pre-wrap">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div className="ml-3">
                  {n.read ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600">Read</span>
                  ) : (
                    <button onClick={() => markRead(n._id)} className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Mark as read</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VendorNotices;
