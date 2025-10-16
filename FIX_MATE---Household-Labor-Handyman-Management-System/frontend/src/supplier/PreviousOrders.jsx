import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import SupplierContext from "../Context/SupplierContextDefs";

const PreviousOrders = () => {
  const { supplierData } = useContext(SupplierContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!supplierData?._id) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/supply-orders/supplier/${supplierData._id}`);
      if (data.success) {
        setOrders(
          (data.orders || []).filter(order => order.status === 'Delivered' || order.status === 'Cancelled')
        );
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
  }, [supplierData]);

  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-4">Previous Orders</h2>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700 text-gray-400">No previous orders.</div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1 text-gray-200">
                <div className="mb-2">
                  <span className="text-gray-400">Customer:</span> <span className="ml-1 text-white font-semibold">{order.name}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Phone:</span> <span className="ml-1 text-white">{order.phone}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Email:</span> <span className="ml-1 text-white">{order.email}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Address:</span> <span className="ml-1 text-white">{order.address}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Date:</span> <span className="ml-1 text-white">{order.date}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Product:</span> <span className="ml-1 text-white">{order.productId?.name || order.productName}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Amount:</span> <span className="ml-1 text-white">{order.amount || 1}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Total Price:</span> <span className="ml-1 text-green-400 font-semibold">Rs.{(order.amount || 1) * (order.productId?.price || 0)}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Payment Method:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentMethod === 'Card Payment'
                      ? 'bg-green-600/20 text-green-300 border border-green-600/40' 
                      : 'bg-blue-600/20 text-blue-200 border border-blue-600/40'
                  }`}>
                    {order.paymentMethod}
                  </span>
                </div>
                {order.notes && (
                  <div className="mb-2">
                    <span className="text-gray-400">Notes:</span> <span className="ml-1 text-gray-300">{order.notes}</span>
                  </div>
                )}
                <div className="mb-2">
                  <span className="text-gray-400">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-600/20 text-green-300 border border-green-600/40' 
                      : 'bg-red-600/20 text-red-200 border border-red-600/40'
                  }`}>
                    {order.status}
                  </span>
                </div>
                {order.status === 'Delivered' && order.supplierRevenue && (
                  <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-600/30">
                    <span className="text-gray-300">Revenue Earned:</span> 
                    <span className="ml-1 text-green-400 font-bold">${order.supplierRevenue.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 ml-1">(80% of total)</span>
                  </div>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousOrders;
