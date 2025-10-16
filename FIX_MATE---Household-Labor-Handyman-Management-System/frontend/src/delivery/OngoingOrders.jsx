import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DeliveryContext } from "../Context/DeliveryContext";
import { toast } from "react-toastify";

const OngoingOrders = () => {
  const { deliveryData } = useContext(DeliveryContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch ongoing delivery orders (Out for Delivery status)
  const fetchOngoingOrders = useCallback(async () => {
    if (!deliveryData) {
      console.log('No delivery data available');
      return;
    }
    
    const driverId = deliveryData.id || deliveryData._id;
    if (!driverId) {
      console.log('No delivery driver ID available');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get('/api/supply-orders/');
      if (data.success) {
        // Filter orders that are assigned to this driver and out for delivery
        const ongoingOrders = data.orders.filter(order => 
          order.status === 'Out for Delivery' && 
          order.assignedDeliveryDriver && (
            order.assignedDeliveryDriver.id?.toString() === driverId.toString() ||
            order.assignedDeliveryDriver._id?.toString() === driverId.toString()
          )
        );
        setOrders(ongoingOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching ongoing orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [deliveryData]);

  useEffect(() => {
    if (deliveryData) {
      fetchOngoingOrders();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchOngoingOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [deliveryData, fetchOngoingOrders]);

  const handleMarkDelivered = (order) => {
    // Calculate delivery fee (10% of order total)
    const totalAmount = (order.amount || 1) * (order.productId?.price || 0);
    const deliveryFee = totalAmount * 0.1;
    const supplierRevenue = totalAmount * 0.8;
    const serviceFee = totalAmount * 0.2;

    toast.info(
      <div>
        <div className="mb-3">Mark delivery as completed?</div>
        <div className="mb-3 text-sm bg-blue-50 p-3 rounded text-black">
          <div><strong>Customer:</strong> {order.name}</div>
          <div><strong>Product:</strong> {order.productId?.name || order.productName}</div>
          <div><strong>Total Order Value:</strong> Rs.{totalAmount.toFixed(2)}</div>
          <div><strong>Your Delivery Fee:</strong> Rs.{deliveryFee.toFixed(2)} (10%)</div>
          <div><strong>Supplier Revenue:</strong> Rs.{supplierRevenue.toFixed(2)} (80%)</div>
          <div><strong>Service Fee:</strong> Rs.{serviceFee.toFixed(2)} (20%)</div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                const { data } = await axios.patch(`/api/supply-orders/${order._id}/complete-delivery`, {
                  supplierRevenue: supplierRevenue,
                  serviceFee: serviceFee,
                  totalAmount: totalAmount,
                  deliveryFee: deliveryFee
                });
                if (data.success) {
                  toast.success(`Delivery completed! You earned $${deliveryFee.toFixed(2)}.`);
                  fetchOngoingOrders();
                } else {
                  toast.error('Failed to mark as delivered');
                }
              } catch (error) {
                console.error('Error completing delivery:', error);
                toast.error('Failed to mark as delivered');
              }
            }}
          >
            Confirm Delivery
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
        <h2 className="text-xl font-semibold mb-4">Ongoing Orders</h2>
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Ongoing Orders</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Active Deliveries: <span className="text-yellow-400">{orders.length}</span>
          </div>
          <button
            onClick={fetchOngoingOrders}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Ongoing Orders</h3>
            <p className="text-gray-500">
              You don't have any active delivery orders at the moment.
            </p>
            <p className="text-gray-500 mt-2">
              Accepted orders will appear here during the delivery process.
            </p>
          </div>
          <button
            onClick={fetchOngoingOrders}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            Refresh Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-800 rounded-lg p-6 border border-yellow-600/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                      Out for Delivery
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
                  <div className="text-lg font-bold text-yellow-400">
                    ${((order.amount || 1) * (order.productId?.price || 0) * 0.1).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Delivery Fee</div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Delivery Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Product:</span>
                    <div className="text-white">{order.productId?.name || order.productName}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Quantity:</span>
                    <div className="text-white">{order.amount || 1}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Customer Email:</span>
                    <div className="text-white">{order.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Payment Method:</span>
                    <div className="text-white">{order.paymentMethod}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Date Needed:</span>
                    <div className="text-white">{new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Value:</span>
                    <div className="text-white">Rs.{(order.amount || 1) * (order.productId?.price || 0)}</div>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-3">
                    <span className="text-gray-400">Customer Notes:</span>
                    <div className="text-white mt-1">{order.notes}</div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => window.open(`tel:${order.phone}`, '_self')}
                >
                  Contact Customer
                </button>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => handleMarkDelivered(order)}
                >
                  Mark as Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OngoingOrders;