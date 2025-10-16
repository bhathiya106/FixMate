import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DeliveryContext } from "../Context/DeliveryContext";
import { toast } from "react-toastify";

const AvailableOrders = () => {
  const { deliveryData } = useContext(DeliveryContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders assigned to this delivery driver
  const fetchAvailableOrders = useCallback(async () => {
    console.log('=== FETCH AVAILABLE ORDERS DEBUG ===');
    console.log('deliveryData:', deliveryData);
    console.log('deliveryData.id:', deliveryData?.id);
    console.log('deliveryData._id:', deliveryData?._id);
    
    if (!deliveryData) {
      console.log('❌ No delivery data available - user might not be logged in');
      return;
    }
    
    const driverId = deliveryData.id || deliveryData._id;
    if (!driverId) {
      console.log('❌ No delivery driver ID available in context');
      console.log('Available delivery data keys:', Object.keys(deliveryData));
      return;
    }
    
    setLoading(true);
    try {
      console.log('✅ Fetching orders for delivery driver:', driverId);
      // Get all supply orders and filter for those assigned to this driver
      const { data } = await axios.get('/api/supply-orders/');
      if (data.success) {
        console.log('📦 All orders received:', data.orders.length);
        console.log('📦 Sample order structure:', data.orders[0]);
        
        // Filter orders that are assigned to this delivery driver and waiting for acceptance
        const assignedOrders = data.orders.filter(order => {
          const isWaitingForDelivery = order.status === 'Waiting for Delivery';
          const hasAssignedDriver = !!order.assignedDeliveryDriver;
          const isAssignedToThisDriver = order.assignedDeliveryDriver && (
            order.assignedDeliveryDriver.id?.toString() === driverId.toString() ||
            order.assignedDeliveryDriver._id?.toString() === driverId.toString()
          );
          
          console.log(`🔍 Order ${order._id}:`, {
            status: order.status,
            assignedDriver: order.assignedDeliveryDriver,
            isWaitingForDelivery,
            hasAssignedDriver,
            isAssignedToThisDriver,
            driverDataId: driverId,
            assignedDriverId: order.assignedDeliveryDriver?.id || order.assignedDeliveryDriver?._id
          });
          
          return isWaitingForDelivery && isAssignedToThisDriver;
        });
        
        console.log('✅ Filtered assigned orders:', assignedOrders.length);
        setOrders(assignedOrders);
      } else {
        console.log('❌ Failed to fetch orders:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [deliveryData]);

  useEffect(() => {
    if (deliveryData) {
      fetchAvailableOrders();
      // Set up auto-refresh every 30 seconds to check for new assignments
      const interval = setInterval(fetchAvailableOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [deliveryData, fetchAvailableOrders]);

  const handleAcceptOrder = async (orderId) => {
    toast.info(
      <div>
        <div className="mb-2">Accept this delivery order?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                const { data } = await axios.patch(`/api/supply-orders/${orderId}/accept-delivery`);
                if (data.success) {
                  toast.success('Order accepted! You can now start the delivery.');
                  fetchAvailableOrders();
                } else {
                  toast.error('Failed to accept order');
                }
              } catch (error) {
                console.error('Error accepting order:', error);
                toast.error('Failed to accept order');
              }
            }}
          >
            Yes, Accept
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

  const handleRejectOrder = async (orderId) => {
    toast.info(
      <div>
        <div className="mb-2">Reject this delivery order? It will be returned to the supplier.</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                const { data } = await axios.patch(`/api/supply-orders/${orderId}/cancel-delivery`);
                if (data.success) {
                  toast.success('Order rejected and returned to supplier.');
                  fetchAvailableOrders();
                } else {
                  toast.error('Failed to reject order');
                }
              } catch (error) {
                console.error('Error rejecting order:', error);
                toast.error('Failed to reject order');
              }
            }}
          >
            Yes, Reject
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

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Available Orders</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Operating Area: <span className="text-green-400">{deliveryData?.operatingArea || 'Not set'}</span>
          </div>
          <button
            onClick={fetchAvailableOrders}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Orders Assigned</h3>
            <p className="text-gray-500">
              There are currently no delivery orders assigned to you.
            </p>
            <p className="text-gray-500 mt-2">
              Orders will appear here when suppliers assign deliveries to you.
            </p>
            {deliveryData && (
              <p className="text-xs text-gray-600 mt-2">
                Driver ID: {deliveryData.id || deliveryData._id} | Name: {deliveryData.name}
              </p>
            )}
          </div>
          <button
            onClick={fetchAvailableOrders}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Refresh Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-800 rounded-lg p-6 border border-green-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                      New Assignment
                    </span>
                    <span className="text-sm text-gray-400">
                      Order #{order._id.slice(-6)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Customer: {order.name}</h3>
                  <p className="text-gray-300">{order.address}</p>
                  <p className="text-sm text-gray-400">Phone: {order.phone}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    ${((order.amount || 1) * (order.productId?.price || 0) * 0.1).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Delivery Fee (10%)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-300">
                <div>
                  <div className="mb-2">
                    <span className="text-gray-400">Product:</span> {order.productId?.name || order.productName}
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400">Quantity:</span> {order.amount || 1}
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400">Total Value:</span> ${(order.amount || 1) * (order.productId?.price || 0)}
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="text-gray-400">Payment:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      order.paymentMethod === 'Card Payment'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400">Customer Email:</span> {order.email}
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400">Date Needed:</span> {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400 font-semibold">Customer Notes:</span>
                  <p className="text-gray-300 mt-1">{order.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={() => handleRejectOrder(order._id)}
                >
                  Reject Order
                </button>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => handleAcceptOrder(order._id)}
                >
                  Accept Order
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