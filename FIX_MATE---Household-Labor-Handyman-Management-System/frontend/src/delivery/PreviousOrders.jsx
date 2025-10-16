import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DeliveryContext } from "../Context/DeliveryContext";

const PreviousOrders = () => {
  const { deliveryData } = useContext(DeliveryContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch previous delivery orders (Delivered status)
  const fetchPreviousOrders = useCallback(async () => {
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
        // Filter orders that are assigned to this driver and delivered
        const deliveredOrders = data.orders.filter(order => 
          order.status === 'Delivered' && 
          order.assignedDeliveryDriver && (
            order.assignedDeliveryDriver.id?.toString() === driverId.toString() ||
            order.assignedDeliveryDriver._id?.toString() === driverId.toString()
          )
        );
        setOrders(deliveredOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching previous orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [deliveryData]);

  useEffect(() => {
    if (deliveryData) {
      fetchPreviousOrders();
    }
  }, [deliveryData, fetchPreviousOrders]);



  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-4">Previous Orders</h2>
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Previous Orders</h2>
        <button
          onClick={fetchPreviousOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Orders
        </button>
      </div>

      {/* Revenue Summary removed per request */}

      {loading ? (
        <div className="text-gray-600">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Previous Orders</h3>
            <p className="text-gray-500">
              You haven't completed any deliveries yet.
            </p>
            <p className="text-gray-500 mt-2">
              Completed deliveries will appear here with earnings details.
            </p>
          </div>
          <button
            onClick={fetchPreviousOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderTotal = (order.amount || 1) * (order.productId?.price || 0);
            const deliveryFee = orderTotal * 0.1;
            
            return (
              <div key={order._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        ✅ Delivered
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
                      ${deliveryFee.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">Earned</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-300">
                  <div>
                    <div className="mb-2">
                      <span className="text-gray-400">Product:</span>
                      <div className="text-white">{order.productId?.name || order.productName}</div>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-400">Quantity:</span>
                      <div className="text-white">{order.amount || 1}</div>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-400">Order Value:</span>
                      <div className="text-white">${orderTotal.toFixed(2)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="text-gray-400">Payment Method:</span>
                      <div className="text-white">{order.paymentMethod}</div>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-400">Delivery Date:</span>
                      <div className="text-white">{new Date(order.deliveryCompletedAt || order.updatedAt).toLocaleDateString()}</div>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-400">Customer Email:</span>
                      <div className="text-white">{order.email}</div>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-600/30">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">💰 Revenue Breakdown</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Order Total:</span>
                      <div className="text-white font-semibold">${orderTotal.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Your Fee (10%):</span>
                      <div className="text-green-400 font-semibold">${deliveryFee.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Supplier Share:</span>
                      <div className="text-white font-semibold">${(orderTotal * 0.8).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 bg-gray-700 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-300 mb-1">Customer Notes</h4>
                    <p className="text-sm text-gray-400">"{order.notes}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Performance Info */}
      <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-400">Delivery Performance</h4>
            <p className="text-sm text-gray-300 mt-1">
              Your delivery history helps build trust with customers. Maintain 
              timely deliveries to receive more orders and better earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousOrders;