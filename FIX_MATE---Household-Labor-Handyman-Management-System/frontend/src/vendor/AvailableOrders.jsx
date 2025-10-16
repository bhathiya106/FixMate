import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { VendorContext } from "../Context/VendorContext";
import { toast } from "react-toastify";

const AvailableOrders = () => {
  const { vendorData, backendUrl, loading } = useContext(VendorContext) || {};
  const [orders, setOrders] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchOrders = async () => {
    if (!vendorData?._id) {
      console.log('No vendorData._id, skipping fetch. vendorData:', vendorData);
      return;
    }
    setFetchLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/vendor/${vendorData._id}`);
      if (data.success) {
        setOrders(data.orders.filter(order => order.status === 'pending'));
      } else {
        setOrders([]);
      }
    } catch (err) {
      setOrders([]);
      console.log('Error fetching orders:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [vendorData, backendUrl]);

  const handleAccept = (orderId) => {
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to accept this order?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.patch(`${backendUrl}/api/orders/${orderId}/status`, { status: 'ongoing' });
                toast.success('Order accepted and moved to Ongoing Orders.');
                fetchOrders(); // Refresh the available orders list
              } catch {
                toast.error('Failed to accept order.');
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

  const handleReject = (orderId) => {
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to reject this order?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(`${backendUrl}/api/orders/${orderId}`);
                toast.success('Order rejected and removed.');
                fetchOrders();
              } catch {
                toast.error('Failed to reject order.');
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
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Available Orders</h2>
      {loading ? (
        <div className="text-gray-300">Loading vendor data...</div>
      ) : !vendorData?._id ? (
        <div className="text-red-400">Please log in to view orders.</div>
      ) : fetchLoading ? (
        <div className="text-gray-300">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400">No available orders.</div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border border-gray-700 rounded-xl p-6 bg-gray-800 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1 text-gray-200">
                <div className="mb-2">
                  <span className="font-semibold">Customer:</span> <span className="ml-1">{order.name}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Phone:</span> <span className="ml-1">{order.phone}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Email:</span> <span className="ml-1">{order.email}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Address:</span> <span className="ml-1">{order.address}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Date:</span> <span className="ml-1">{order.date}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Payment Method:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${
                    order.paymentMethod === 'Card Payment'
                      ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700' 
                      : 'bg-blue-900/30 text-blue-300 border-blue-700'
                  }`}>
                    {order.paymentMethod === 'Card Payment' ? '💳 Card Payment' : '💰 Pay on Arrival'}
                  </span>
                </div>
                {order.notes && (
                  <div className="mb-2">
                    <span className="font-semibold">Notes:</span> <span className="ml-1 text-gray-300">{order.notes}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  onClick={() => handleAccept(order._id)}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={() => handleReject(order._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableOrders;
