import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DeliveryContext } from "../Context/DeliveryContext";

const Revenue = () => {
  const { deliveryData } = useContext(DeliveryContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Fetch delivered orders to calculate real revenue
  const fetchDeliveredOrders = useCallback(async () => {
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
      console.error('Error fetching delivered orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [deliveryData]);

  useEffect(() => {
    if (deliveryData) {
      fetchDeliveredOrders();
    }
  }, [deliveryData, fetchDeliveredOrders]);

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      // Generate delivery revenue report
      const reportContent = generateReportContent();
      downloadReport(reportContent);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateReportContent = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate metrics
    const totalOrderValue = orders.reduce((sum, order) => {
      const orderTotal = (Number(order.amount) || 1) * (Number(order.productId?.price) || 0);
      return sum + orderTotal;
    }, 0);

    const totalDeliveryFees = totalOrderValue * 0.1;
    const driverEarnings = totalDeliveryFees * 0.8;
    const adminCommission = totalDeliveryFees * 0.2;
    const avgEarningsPerDelivery = orders.length > 0 ? driverEarnings / orders.length : 0;

    // Calculate this month's earnings
    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.deliveryCompletedAt || order.updatedAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    const thisMonthValue = thisMonthOrders.reduce((sum, order) => {
      const orderTotal = (Number(order.amount) || 1) * (Number(order.productId?.price) || 0);
      return sum + orderTotal;
    }, 0);
    const thisMonthEarnings = (thisMonthValue * 0.1) * 0.8;

    // Create CSV header and summary rows
    let csvContent = [
      ['DELIVERY DRIVER REVENUE REPORT'],
      ['Generated Date', currentDate],
      [''],
      ['DRIVER INFORMATION'],
      ['Name', deliveryData?.name || 'Unknown'],
      ['Email', deliveryData?.email || 'Unknown'],
      ['Operating Area', deliveryData?.operatingArea || 'Not specified'],
      ['Status', deliveryData?.isAvailable ? 'Active' : 'Inactive'],
      ['Join Date', deliveryData?.createdAt ? new Date(deliveryData.createdAt).toLocaleDateString() : 'Unknown'],
      [''],
      ['SUMMARY METRICS'],
      ['Total Delivered Orders', orders.length],
      ['Total Order Value', `Rs. ${totalOrderValue.toFixed(2)}`],
      ['Total Delivery Fees (10%)', `Rs. ${totalDeliveryFees.toFixed(2)}`],
      ['Driver Total Earnings', `Rs. ${driverEarnings.toFixed(2)}`],
      ['Average per Delivery', `Rs. ${avgEarningsPerDelivery.toFixed(2)}`],
      ['This Month Earnings', `Rs. ${thisMonthEarnings.toFixed(2)}`],
      ['Admin Commission', `Rs. ${adminCommission.toFixed(2)}`],
      [''],
      ['DELIVERY DETAILS'],
      ['Order ID', 'Customer', 'Address', 'Date', 'Order Value', 'Delivery Fee', 'Driver Earnings', 'Status']
    ];

    // Add order details
    orders.forEach(order => {
      const orderTotal = (Number(order.amount) || 1) * (Number(order.productId?.price) || 0);
      const deliveryFee = orderTotal * 0.1;
      const driverShare = deliveryFee * 0.8;
      
      csvContent.push([
        order._id,
        order.name || 'N/A',
        order.address || 'N/A',
        new Date(order.deliveryCompletedAt || order.updatedAt).toLocaleDateString(),
        orderTotal.toFixed(2),
        deliveryFee.toFixed(2),
        driverShare.toFixed(2),
        'Delivered'
      ]);
    });

    // Convert array to CSV string
    return csvContent.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    ).join(',')).join('\n');
  };

  const downloadReport = (content) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `delivery-revenue-report-${deliveryData?.name || 'driver'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (deliveryData) {
      fetchDeliveredOrders();
    }
  }, [deliveryData, fetchDeliveredOrders]);

  // Calculate revenue metrics from real order data
  const getRevenueMetrics = () => {
    const totalOrderValue = orders.reduce((sum, order) => {
      const orderTotal = (Number(order.amount) || 1) * (Number(order.productId?.price) || 0);
      return sum + orderTotal;
    }, 0);

    const totalDeliveryFees = totalOrderValue * 0.1; // 10% delivery fee
    const driverEarnings = totalDeliveryFees * 0.8; // Driver gets 80% of delivery fees
    const avgEarningsPerDelivery = orders.length > 0 ? driverEarnings / orders.length : 0;

    // Calculate this month's earnings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.deliveryCompletedAt || order.updatedAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    const thisMonthValue = thisMonthOrders.reduce((sum, order) => {
      const orderTotal = (Number(order.amount) || 1) * (Number(order.productId?.price) || 0);
      return sum + orderTotal;
    }, 0);
    const thisMonthEarnings = (thisMonthValue * 0.1) * 0.8; // 80% of 10% delivery fee

    return {
      totalEarnings: driverEarnings,
      totalDeliveries: orders.length,
      avgDeliveryFee: avgEarningsPerDelivery,
      thisMonth: thisMonthEarnings,
      totalOrderValue,
      totalDeliveryFees
    };
  };

  const revenueMetrics = getRevenueMetrics();

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-4">Revenue Dashboard</h2>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Revenue Dashboard</h2>
        <button
          onClick={generateReport}
          disabled={generatingReport}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
            generatingReport
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {generatingReport ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-900/30 border border-green-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-green-300">Rs. {revenueMetrics.totalEarnings.toFixed(2)}</p>
              <p className="text-green-400 text-xs mt-1">80% of delivery fees</p>
            </div>
            <div className="bg-green-600/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Deliveries</p>
              <p className="text-3xl font-bold text-blue-300">{revenueMetrics.totalDeliveries}</p>
              <p className="text-blue-400 text-xs mt-1">Completed orders</p>
            </div>
            <div className="bg-blue-600/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-yellow-300">Rs. {revenueMetrics.thisMonth.toFixed(2)}</p>
              <p className="text-yellow-400 text-xs mt-1">Current month earnings</p>
            </div>
            <div className="bg-yellow-600/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/30 border border-purple-600/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Average per Delivery</p>
              <p className="text-3xl font-bold text-purple-300">Rs. {revenueMetrics.avgDeliveryFee.toFixed(2)}</p>
              <p className="text-purple-400 text-xs mt-1">Your average rate</p>
            </div>
            <div className="bg-purple-600/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structure Info */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
          Fee Structure & Earnings Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Rs. {revenueMetrics.totalOrderValue.toFixed(2)}</div>
              <div className="text-sm text-gray-400">Total Order Value</div>
              <div className="text-xs text-gray-500 mt-1">Orders you delivered</div>
            </div>
          </div>
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Rs. {revenueMetrics.totalDeliveryFees.toFixed(2)}</div>
              <div className="text-sm text-gray-400">Total Delivery Fees (10%)</div>
              <div className="text-xs text-gray-500 mt-1">Fees collected from orders</div>
            </div>
          </div>
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">Rs. {(revenueMetrics.totalDeliveryFees * 0.2).toFixed(2)}</div>
              <div className="text-sm text-gray-400">Admin Commission (20%)</div>
              <div className="text-xs text-gray-500 mt-1">Platform service fee</div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-300">
            💡 <strong>How it works:</strong> You earn 80% of the 10% delivery fee charged on each order. 
            The remaining 20% goes to platform maintenance and support services.
          </p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{deliveryData?.operatingArea || 'Not set'}</div>
            <div className="text-sm text-gray-400">Operating Area</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${deliveryData?.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
              {deliveryData?.isAvailable ? 'Active' : 'Inactive'}
            </div>
            <div className="text-sm text-gray-400">Status</div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={fetchDeliveredOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Revenue Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Revenue;