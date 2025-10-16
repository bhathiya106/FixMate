import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { VendorContext } from "../Context/VendorContext";
import { toast } from "react-toastify";

const OngoingOrders = () => {
  const { vendorData, backendUrl, loading } = useContext(VendorContext) || {};
  const [orders, setOrders] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(1);

  const fetchOrders = async () => {
    if (!vendorData?._id) return;
    setFetchLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/vendor/${vendorData._id}`);
      if (data.success) {
        setOrders(data.orders.filter(order => order.status === 'ongoing'));
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [vendorData, backendUrl]);

  const handleMarkDone = (order) => {
    setHoursWorked(1);
    
    // Calculate totals based on hours
    const calculateTotals = (hours) => {
      const totalAmount = (vendorData.hourlyRate || 0) * hours;
      const vendorRevenue = totalAmount * 0.8;
      const serviceFee = totalAmount * 0.2;
      return { totalAmount, vendorRevenue, serviceFee };
    };

    toast.info(
      <div>
        <div className="mb-3">Complete Order for {order.name}</div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Hours Worked:</label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            defaultValue={1}
            className="w-full p-2 border rounded text-black"
            onChange={(e) => {
              const hours = parseFloat(e.target.value) || 1;
              setHoursWorked(hours);
              
              // Update the totals display
              const { totalAmount, vendorRevenue, serviceFee } = calculateTotals(hours);
              
              // Update the display elements
              const totalEl = document.getElementById('total-amount-display');
              const revenueEl = document.getElementById('revenue-display');
              const feeEl = document.getElementById('fee-display');
              
              if (totalEl) totalEl.textContent = `$${totalAmount.toFixed(2)}`;
              if (revenueEl) revenueEl.textContent = `$${vendorRevenue.toFixed(2)}`;
              if (feeEl) feeEl.textContent = `$${serviceFee.toFixed(2)}`;
            }}
          />
        </div>
        <div className="mb-3 text-sm bg-blue-50 p-3 rounded text-black">
          <div><strong>Hourly Rate:</strong> Rs.{vendorData.hourlyRate || 0}</div>
          <div><strong>Total Amount:</strong> <span id="total-amount-display">Rs.{(vendorData.hourlyRate || 0).toFixed(2)}</span></div>
          <div><strong>Your Revenue (80%):</strong> <span id="revenue-display">Rs.{((vendorData.hourlyRate || 0) * 0.8).toFixed(2)}</span></div>
          <div><strong>Service Fee (20%):</strong> <span id="fee-display">Rs.{((vendorData.hourlyRate || 0) * 0.2).toFixed(2)}</span></div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                const { totalAmount, vendorRevenue, serviceFee } = calculateTotals(hoursWorked);
                
                // Update order status and save revenue
                await axios.patch(`${backendUrl}/api/orders/${order._id}/status`, { 
                  status: 'done',
                  vendorRevenue: vendorRevenue,
                  serviceFee: serviceFee,
                  totalAmount: totalAmount,
                  hoursWorked: hoursWorked
                });
                toast.success(`Order completed! Revenue of $${vendorRevenue.toFixed(2)} added to your account.`);
                fetchOrders(); // Refresh the ongoing orders list
                // cleared
              } catch {
                toast.error('Failed to mark as done.');
              }
            }}
          >
            Complete Order
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs"
            onClick={() => {
              toast.dismiss();
              // cancelled
            }}
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
      <h2 className="text-xl font-semibold mb-4 text-white">Ongoing Orders</h2>
      {loading ? (
        <div className="text-gray-300">Loading vendor data...</div>
      ) : !vendorData?._id ? (
        <div className="text-red-400">Please log in to view orders.</div>
      ) : fetchLoading ? (
        <div className="text-gray-300">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400">No ongoing orders.</div>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  onClick={() => handleMarkDone(order)}
                >
                  Mark as Done
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
