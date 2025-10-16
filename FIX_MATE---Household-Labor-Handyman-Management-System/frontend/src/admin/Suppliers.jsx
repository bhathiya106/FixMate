import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/supplier/all');
      if (data.success) {
        setSuppliers(data.suppliers);
      } else {
        setSuppliers([]);
      }
    } catch {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleRemove = (supplierId) => {
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to remove this supplier?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(`/api/supplier/${supplierId}`);
                toast.success('Supplier removed.');
                fetchSuppliers();
              } catch {
                toast.error('Failed to remove supplier.');
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
        <h2 className="text-2xl font-bold text-white">Suppliers Management</h2>
        <button onClick={fetchSuppliers} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Refresh</button>
      </div>
      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : suppliers.length === 0 ? (
        <div className="text-gray-400">No suppliers found.</div>
      ) : (
        <div className="overflow-x-auto border border-gray-800 rounded-lg">
          <table className="min-w-full bg-gray-900 rounded-lg">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-white">Name</th>
                <th className="px-4 py-3 text-left text-white">Email</th>
                <th className="px-4 py-3 text-left text-white">Verified</th>
                <th className="px-4 py-3 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier._id} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-gray-200">{supplier.name}</td>
                  <td className="px-4 py-3 text-gray-200">{supplier.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${supplier.isAccountVerified ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700' : 'bg-yellow-900/30 text-yellow-300 border-yellow-700'}`}>
                      {supplier.isAccountVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      onClick={() => handleRemove(supplier._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                      onClick={() => {
                        const reason = window.prompt('Enter a reason for ban (optional):') || '';
                        toast.info(
                          <div>
                            <div className="mb-2">Are you sure you want to ban this supplier? They will be blocked from login and registration.</div>
                            <div className="flex gap-2 justify-end">
                              <button
                                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                                onClick={async () => {
                                  toast.dismiss();
                                  try {
                                    await axios.post('/api/supplier/admin/ban', { email: supplier.email, reason });
                                    toast.success('Supplier banned.');
                                  } catch {
                                    toast.error('Failed to ban supplier.');
                                  }
                                }}
                              >
                                Yes
                              </button>
                              <button className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs" onClick={() => toast.dismiss()}>Cancel</button>
                            </div>
                          </div>,
                          { autoClose: false, closeOnClick: false, closeButton: false, position: 'top-center' }
                        );
                      }}
                    >
                      Ban
                    </button>
                    <button
                      className="px-3 py-1 bg-amber-700 text-white rounded hover:bg-amber-800 text-xs"
                      onClick={() => {
                        toast.info(
                          <div>
                            <div className="mb-2">Unban this supplier?</div>
                            <div className="flex gap-2 justify-end">
                              <button
                                className="px-3 py-1 bg-amber-700 text-white rounded hover:bg-amber-800 text-xs"
                                onClick={async () => {
                                  toast.dismiss();
                                  try {
                                    await axios.post('/api/supplier/admin/unban', { email: supplier.email });
                                    toast.success('Supplier unbanned.');
                                  } catch {
                                    toast.error('Failed to unban supplier.');
                                  }
                                }}
                              >
                                Yes
                              </button>
                              <button className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs" onClick={() => toast.dismiss()}>Cancel</button>
                            </div>
                          </div>,
                          { autoClose: false, closeOnClick: false, closeButton: false, position: 'top-center' }
                        );
                      }}
                    >
                      Unban
                    </button>
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                      onClick={() => {
                        let message = '';
                        toast.info(
                          <div>
                            <div className="mb-2 font-semibold text-white">Send Note to {supplier.name}</div>
                            <textarea id="_note_area" className="w-full h-24 bg-gray-800 text-gray-200 p-2 rounded border border-gray-700" placeholder="Write your message..." onChange={(e)=>{message=e.target.value;}} />
                            <div className="flex gap-2 justify-end mt-2">
                              <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 text-xs" onClick={() => toast.dismiss()}>Cancel</button>
                              <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs" onClick={async ()=>{
                                try {
                                  if(!message.trim()) { toast.warn('Message required'); return; }
                                  await axios.post('/api/supplier/admin/notice', { supplierId: supplier._id, message });
                                  toast.dismiss();
                                  toast.success('Note sent');
                                } catch { toast.error('Failed to send note'); }
                              }}>Send</button>
                            </div>
                          </div>,
                          { autoClose: false, closeOnClick: false, closeButton: false, position: 'top-center' }
                        );
                      }}
                    >
                      Send Note
                    </button>
                    {!supplier.isAccountVerified && (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        onClick={() => {
                          toast.info(
                            <div>
                              <div className="mb-2">Are you sure you want to verify this supplier?</div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                  onClick={async () => {
                                    toast.dismiss();
                                    try {
                                      await axios.put(`/api/supplier/verify/${supplier._id}`);
                                      toast.success('Supplier verified.');
                                      fetchSuppliers();
                                    } catch {
                                      toast.error('Failed to verify supplier.');
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
                        }}
                      >
                        Verify
                      </button>
                    )}
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

export default Suppliers;
