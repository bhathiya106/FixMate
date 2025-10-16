import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/user/all');
      if (data.success) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemove = (userId) => {
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to remove this user?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(`/api/user/${userId}`);
                toast.success('User removed.');
                fetchUsers();
              } catch {
                toast.error('Failed to remove user.');
              }
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false, position: 'top-center' }
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Users Management</h2>
        <button onClick={fetchUsers} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Refresh</button>
      </div>
      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-400">No users found.</div>
      ) : (
        <div className="overflow-x-auto border border-gray-800 rounded-lg">
          <table className="min-w-full bg-gray-900 rounded-lg">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-white">Name</th>
                <th className="px-4 py-3 text-left text-white">Email</th>
                <th className="px-4 py-3 text-left text-white">Role</th>
                <th className="px-4 py-3 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-gray-200">{user.name}</td>
                  <td className="px-4 py-3 text-gray-200">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium border bg-indigo-900/30 text-indigo-300 border-indigo-700">{user.role || 'User'}</span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      onClick={() => handleRemove(user._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
