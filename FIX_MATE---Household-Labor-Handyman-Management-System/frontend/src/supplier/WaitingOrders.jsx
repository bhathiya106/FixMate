import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import SupplierContext from "../Context/SupplierContextDefs";
import { toast } from "react-toastify";

const WaitingOrders = () => {
  const { supplierData } = useContext(SupplierContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWaitingOrders = async () => {
    if (!supplierData?._id) {
      console.log('No supplierData._id, skipping fetch. supplierData:', supplierData);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/supply-orders/supplier/${supplierData._id}`);
      if (data.success) {
        // Filter orders that are waiting for delivery acceptance
        setOrders(
          (data.orders || []).filter(order => order.status === 'Waiting for Delivery')
        );
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching waiting orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitingOrders();
    // Refresh every 30 seconds to check for delivery driver responses
    const interval = setInterval(fetchWaitingOrders, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [supplierData]);

  const handleCancelDeliveryRequest = (orderId) => {
    toast.info(
      <div>
        <div className="mb-2">Cancel delivery request and return to Available Orders?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.patch(`/api/supply-orders/${orderId}/cancel-delivery`);
                toast.success('Delivery request cancelled. Order returned to Available Orders.');
                fetchWaitingOrders();
              } catch (error) {
                toast.error('Failed to cancel delivery request.');
              }
            }}
          >
            Yes, Cancel
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs"
            onClick={() => toast.dismiss()}
          >
            Keep Waiting
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false, position: 'top-center' }
    );
  };

  const getTimeWaiting = (assignedAt) => {
    if (!assignedAt) return 'Unknown';
    const now = new Date();
    const assigned = new Date(assignedAt);
    const diffInMinutes = Math.floor((now - assigned) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Waiting Orders</h2>
        <button
          onClick={fetchWaitingOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Waiting</h3>
            <p className="text-gray-500">
              No orders are currently waiting for delivery driver acceptance.
            </p>
            <p className="text-gray-500 mt-2">
              Orders will appear here after you assign them to delivery drivers.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border border-yellow-200 rounded-xl p-6 bg-yellow-50 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 text-gray-800">
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
                    <span className="font-semibold">Product:</span> <span className="ml-1">{order.productId?.name || order.productName}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Amount:</span> <span className="ml-1">{order.amount || 1}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Total Price:</span> <span className="ml-1">${(order.amount || 1) * (order.productId?.price || 0)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-2">
                    Waiting for Delivery
                  </div>
                  <div className="text-sm text-gray-600">
                    Waiting: {getTimeWaiting(order.deliveryAssignedAt)}
                  </div>
                </div>
              </div>

              {/* Delivery Driver Info */}
              {order.assignedDeliveryDriver && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Assigned Delivery Driver:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Name:</span> <span className="ml-1">{order.assignedDeliveryDriver.name}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Phone:</span> <span className="ml-1">{order.assignedDeliveryDriver.phone}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    Waiting for driver to accept the delivery request...
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Payment Method:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentMethod === 'Card Payment'
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.paymentMethod === 'Card Payment' ? '💳 Card Payment' : '💰 Cash on Delivery'}
                  </span>
                </div>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={() => handleCancelDeliveryRequest(order._id)}
                >
                  Cancel Delivery Request
                </button>
              </div>

              {order.notes && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <span className="font-semibold text-gray-700">Notes:</span> <span className="ml-1 text-gray-600">{order.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-700">About Waiting Orders</h4>
            <p className="text-sm text-blue-600 mt-1">
              These orders have been assigned to delivery drivers and are waiting for acceptance. 
              If a driver doesn't respond within a reasonable time, you can cancel the delivery request 
              and either assign to another driver or handle the delivery yourself.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingOrders;