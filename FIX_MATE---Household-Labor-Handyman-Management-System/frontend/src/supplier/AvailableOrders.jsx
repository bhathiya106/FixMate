import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import SupplierContext from "../Context/SupplierContextDefs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const AvailableOrders = () => {
  const navigate = useNavigate();
  const { supplierData, loading: contextLoading, isSupplierLoggedin, getAuthHeaders } = useContext(SupplierContext) || {};
  
  // State declarations
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryDrivers, setDeliveryDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    if (!contextLoading && !isSupplierLoggedin) {
      toast.error('Please login to access supplier dashboard');
      navigate('/supplierlogin');
      return;
    }
  }, [contextLoading, isSupplierLoggedin, navigate]);

  const fetchOrders = async () => {
    if (!supplierData?._id) {
      console.log('No supplierData._id, skipping fetch. supplierData:', supplierData);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/supply-orders/supplier/${supplierData._id}`, {
        withCredentials: true,
        headers: {
          ...getAuthHeaders()
        }
      });
      if (data.success) {
        // Debug: log all returned orders
        console.log('Fetched orders from backend:', data.orders);
        setOrders(
          (data.orders || []).filter(order => order.status === 'Pending' || order.status === 'Confirmed')
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

  const fetchDeliveryDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/delivery/drivers`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supplier_token')}`
        }
      });
      console.log('Fetched delivery drivers:', data); // Debug log
      if (data.success) {
        setDeliveryDrivers(data.deliveryDrivers || []);
      } else {
        console.warn('Failed to fetch drivers:', data.message);
        setDeliveryDrivers([]);
      }
    } catch (error) {
      console.error('Error fetching delivery drivers:', error);
      toast.error('Failed to load delivery drivers. Please try again.');
      setDeliveryDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleContactDelivery = (order) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
    fetchDeliveryDrivers();
  };

  const handleAssignDelivery = async () => {
    if (!selectedDriver || !selectedOrder) return;
    
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to assign this delivery to {selectedDriver.name}?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                const response = await axios.patch(`/api/supply-orders/${selectedOrder._id}/assign-delivery`, {
                  deliveryDriverId: selectedDriver._id || selectedDriver.id,
                  deliveryDriverName: selectedDriver.name,
                  deliveryDriverPhone: selectedDriver.phone
                });
                console.log('Assignment response:', response.data); // Debug log
                toast.success('Delivery assigned successfully! Order moved to Waiting Orders.');
                setShowDeliveryModal(false);
                setSelectedOrder(null);
                setSelectedDriver(null);
                fetchOrders();
                navigate('/supplier/waiting');
              } catch (error) {
                console.error('Assignment error:', error.response?.data || error.message);
                toast.error(error.response?.data?.message || 'Failed to assign delivery.');
              }
            }}
          >
            Yes, Assign
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

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [supplierData]);

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
                await axios.patch(`${backendUrl}/api/supply-orders/${orderId}/status`, 
                  { status: 'Confirmed' },
                  {
                    withCredentials: true,
                    headers: {
                      ...getAuthHeaders()
                    }
                  });
                toast.success('Order accepted and moved to Previous Orders.');
                navigate('/supplier/previous');
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
                await axios.delete(`${backendUrl}/api/supply-orders/${orderId}`, {
                  withCredentials: true,
                  headers: {
                    ...getAuthHeaders()
                  }
                });
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

  const handleMarkDelivered = (order) => {
    // Calculate revenue (80% supplier, 20% admin service fee)
    const totalAmount = (order.amount || 1) * (order.productId?.price || 0);
    const supplierRevenue = totalAmount * 0.8;
    const serviceFee = totalAmount * 0.2;
    
    toast.info(
      <div>
        <div className="mb-2">Mark this order as delivered?</div>
        <div className="mb-2 text-sm bg-blue-50 p-3 rounded text-black">
          <div><strong>Product:</strong> {order.productId?.name || order.productName}</div>
          <div><strong>Quantity:</strong> {order.amount || 1}</div>
          <div><strong>Unit Price:</strong> ${(order.productId?.price || 0).toFixed(2)}</div>
          <div><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</div>
          <div><strong>Your Revenue (80%):</strong> ${supplierRevenue.toFixed(2)}</div>
          <div><strong>Service Fee (20%):</strong> ${serviceFee.toFixed(2)}</div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.patch(`${backendUrl}/api/supply-orders/${order._id}/status`, 
                  { 
                    status: 'Delivered',
                    supplierRevenue: supplierRevenue,
                    serviceFee: serviceFee,
                    totalAmount: totalAmount
                  },
                  {
                    withCredentials: true,
                      headers: {
                      ...getAuthHeaders()
                    }
                  });
                toast.success(`Order delivered! Revenue of $${supplierRevenue.toFixed(2)} added to your account.`);
                fetchOrders();
              } catch {
                toast.error('Failed to mark as delivered.');
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

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Available Orders</h2>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Orders
        </button>
      </div>
      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">No Available Orders</h3>
            <p className="text-gray-400">No orders are currently available for processing.</p>
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
                  <span className="font-semibold">Product:</span> <span className="ml-1">{order.productId?.name || order.productName}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Amount:</span> <span className="ml-1">{order.amount || 1}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Total Price:</span> <span className="ml-1">Rs.{(order.amount || 1) * (order.productId?.price || 0)}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Payment Method:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${
                    order.paymentMethod === 'Card Payment'
                      ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700' 
                      : 'bg-blue-900/30 text-blue-300 border-blue-700'
                  }`}>
                    {order.paymentMethod === 'Card Payment' ? '💳 Card Payment' : '💰 Cash on Delivery'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${
                    order.status === 'Confirmed' 
                      ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700' 
                      : 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                {order.notes && (
                  <div className="mb-2">
                    <span className="font-semibold">Notes:</span> <span className="ml-1 text-gray-300">{order.notes}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 items-center">
                {order.status === 'Pending' ? (
                  <>
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
                  </>
                ) : order.status === 'Confirmed' ? (
                  <>
                    <button
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                      onClick={() => handleContactDelivery(order)}
                    >
                      Contact Delivery
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      onClick={() => handleMarkDelivered(order)}
                    >
                      Mark as Delivered
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delivery Driver Selection Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Select Delivery Driver</h3>
              <button
                onClick={() => {
                  setShowDeliveryModal(false);
                  setSelectedOrder(null);
                  setSelectedDriver(null);
                }}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedOrder && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-100 mb-2">Order Details:</h4>
                <p className="text-sm text-gray-300">Customer: {selectedOrder.name}</p>
                <p className="text-sm text-gray-300">Product: {selectedOrder.productId?.name || selectedOrder.productName}</p>
                <p className="text-sm text-gray-300">Address: {selectedOrder.address}</p>
                <p className="text-sm text-gray-300">Amount: {selectedOrder.amount || 1}</p>
              </div>
            )}

            {loadingDrivers ? (
              <div className="text-center py-8 text-gray-300">Loading drivers...</div>
            ) : deliveryDrivers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No delivery drivers available at the moment.</div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {deliveryDrivers.map((driver) => (
                    <div
                      key={driver.id || driver._id}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedDriver?._id === driver._id || selectedDriver?.id === driver.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 hover:border-gray-500 bg-gray-800'
                      }`}
                      onClick={() => setSelectedDriver(driver)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {driver.profileImageUrl ? (
                            <img
                              src={driver.profileImageUrl}
                              alt={driver.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {driver.name?.[0]?.toUpperCase() || 'D'}
                            </div>
                          )}
                          <div>
                            <h5 className="font-semibold text-gray-100">{driver.name}</h5>
                            <p className="text-sm text-gray-300">Rate: Rs.{driver.rate}/delivery</p>
                            <p className="text-sm text-gray-300">Area: {driver.operatingArea}</p>
                            <p className="text-sm text-gray-300">Phone: {driver.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            driver.isAvailable
                              ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700'
                              : 'bg-red-900/30 text-red-300 border-red-700'
                          }`}>
                            {driver.isAvailable ? 'Available' : 'Busy'}
                          </span>
                          <p className="text-sm text-gray-400 mt-1">
                            {driver.totalDeliveries || 0} deliveries
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeliveryModal(false);
                      setSelectedOrder(null);
                      setSelectedDriver(null);
                    }}
                    className="px-4 py-2 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignDelivery}
                    disabled={!selectedDriver || !selectedDriver.isAvailable}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Driver
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Info Card for Contact Delivery Feature */}
      {orders.some(order => order.status === 'Confirmed') && (
        <div className="mt-8 bg-purple-900/20 border border-purple-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-purple-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-300">Delivery Contact Available</h4>
              <p className="text-sm text-purple-200 mt-1">
                You have confirmed orders ready for delivery! Use the "Contact Delivery" button to assign 
                delivery drivers to your orders. Orders will then move to "Waiting Orders" until the driver accepts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableOrders;

