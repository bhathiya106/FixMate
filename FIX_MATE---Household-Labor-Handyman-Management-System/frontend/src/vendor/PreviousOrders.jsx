import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { VendorContext } from "../Context/VendorContext";

const PreviousOrders = () => {
  const { vendorData, backendUrl } = useContext(VendorContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!vendorData?._id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/vendor/${vendorData._id}`);
      if (data.success) {
        setOrders(data.orders.filter(order => order.status === 'done'));
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [vendorData, backendUrl]);

  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Previous Orders</h2>

      {orders.length > 0 && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">📊 Revenue Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">
                {orders.length}
              </div>
              <div className="text-sm text-gray-400">Completed Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">
                ${orders.reduce((total, order) => total + (order.vendorRevenue || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">
                {orders.reduce((total, order) => total + (order.hoursWorked || 0), 0).toFixed(1)}h
              </div>
              <div className="text-sm text-gray-400">Total Hours</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">No Previous Orders</h3>
            <p className="text-gray-400">Complete some orders to see your earnings history here.</p>
          </div>
        </div>
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
                  <span className="font-semibold">Status:</span> 
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium border bg-emerald-900/30 text-emerald-300 border-emerald-700">
                    ✅ Completed
                  </span>
                </div>
                {order.hoursWorked && (
                  <div className="mb-2">
                    <span className="font-semibold">Hours Worked:</span> 
                    <span className="ml-1">{order.hoursWorked} hour{order.hoursWorked !== 1 ? 's' : ''}</span>
                  </div>
                )}
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
                {order.vendorRevenue && (
                  <div className="mb-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="mb-1">
                      <span className="font-semibold">Your Revenue:</span> 
                      <span className="ml-1 text-emerald-300 font-bold text-lg">${order.vendorRevenue.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span>Total Amount: ${(order.totalAmount || 0).toFixed(2)}</span>
                      <span className="mx-2">•</span>
                      <span>Service Fee: ${(order.serviceFee || 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                {order.notes && (
                  <div className="mb-2">
                    <span className="font-semibold">Notes:</span> <span className="ml-1 text-gray-300">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousOrders;
