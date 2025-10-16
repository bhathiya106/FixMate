import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { VendorContext } from "../Context/VendorContext";

const Revenue = () => {
  const { vendorData, backendUrl, loading: vendorLoading } = useContext(VendorContext) || {};
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalServiceFees: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchRevenueData = async () => {
    if (!vendorData?._id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/vendor/${vendorData._id}`);
      if (data.success) {
        const completedOrders = data.orders.filter(order => order.status === 'done');
        
        // Calculate revenue - handle both old and new order formats
        const totalRevenue = completedOrders.reduce((sum, order) => {
          // If order has vendorRevenue field (new format), use it
          if (order.vendorRevenue !== undefined) {
            return sum + order.vendorRevenue;
          }
          // If order has totalAmount field, calculate 80%
          if (order.totalAmount !== undefined) {
            return sum + (order.totalAmount * 0.8);
          }
          // Fallback: use hourly rate as minimum (old format)
          return sum + ((vendorData.hourlyRate || 0) * 0.8);
        }, 0);
        
        const totalServiceFees = completedOrders.reduce((sum, order) => {
          // If order has serviceFee field (new format), use it
          if (order.serviceFee !== undefined) {
            return sum + order.serviceFee;
          }
          // If order has totalAmount field, calculate 20%
          if (order.totalAmount !== undefined) {
            return sum + (order.totalAmount * 0.2);
          }
          // Fallback: use hourly rate as minimum (old format)
          return sum + ((vendorData.hourlyRate || 0) * 0.2);
        }, 0);
        
        const totalOrders = completedOrders.length;
        
        // Get recent completed orders (last 10)
        const recentOrders = completedOrders
          .sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date))
          .slice(0, 10)
          .map(order => ({
            ...order,
            // Ensure vendorRevenue is calculated for display
            vendorRevenue: order.vendorRevenue !== undefined 
              ? order.vendorRevenue 
              : order.totalAmount !== undefined 
                ? order.totalAmount * 0.8 
                : (vendorData.hourlyRate || 0) * 0.8
          }));

        setRevenueData({
          totalRevenue,
          totalOrders,
          totalServiceFees,
          recentOrders
        });
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Error handling - keep default values
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/vendor/${vendorData._id}`);
      if (data.success) {
        const allOrders = data.orders;
        const completedOrders = allOrders.filter(order => order.status === 'done');
        
        // Calculate detailed statistics
        const stats = {
          totalOrders: allOrders.length,
          completedOrders: completedOrders.length,
          pendingOrders: allOrders.filter(order => order.status === 'pending').length,
          ongoingOrders: allOrders.filter(order => order.status === 'ongoing').length,
          cardPayments: completedOrders.filter(order => order.paymentMethod === 'Card Payment').length,
          cashPayments: completedOrders.filter(order => order.paymentMethod !== 'Card Payment').length,
        };

        // Generate report content
        const reportContent = generateReportContent(completedOrders, stats);
        
        // Create and download the report
        downloadReport(reportContent);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateReportContent = (orders, stats) => {
    const currentDate = new Date().toLocaleDateString();
    const totalRevenue = revenueData.totalRevenue;
    const totalServiceFees = revenueData.totalServiceFees;
    const grossRevenue = totalRevenue + totalServiceFees;

    // Create CSV content as array of rows
    let csvContent = [
      ['VENDOR REVENUE REPORT'],
      ['Generated Date:', currentDate],
      [''],
      ['VENDOR INFORMATION'],
      ['Name:', vendorData.name],
      ['Category:', vendorData.category],
      ['Hourly Rate:', `Rs. ${vendorData.hourlyRate}`],
      [''],
      ['REVENUE SUMMARY'],
      ['Total Revenue (80%):', `Rs. ${totalRevenue.toFixed(2)}`],
      ['Platform Fees (20%):', `Rs. ${totalServiceFees.toFixed(2)}`],
      ['Gross Revenue (100%):', `Rs. ${grossRevenue.toFixed(2)}`],
      [''],
      ['ORDER STATISTICS'],
      ['Total Orders:', stats.totalOrders],
      ['Completed Orders:', stats.completedOrders],
      ['Pending Orders:', stats.pendingOrders],
      ['Ongoing Orders:', stats.ongoingOrders],
      [''],
      ['PAYMENT BREAKDOWN'],
      ['Card Payments:', stats.cardPayments],
      ['Cash Payments:', stats.cashPayments],
      [''],
      ['COMPLETED ORDERS DETAILS'],
      [
        'Order ID',
        'Customer Name',
        'Email',
        'Phone',
        'Address',
        'Service Date',
        'Payment Method',
        'Hours Worked',
        'Total Amount',
        'Vendor Revenue',
        'Completion Date',
        'Notes'
      ]
    ];

    // Add order details
    orders.forEach(order => {
      const revenue = order.vendorRevenue !== undefined 
        ? order.vendorRevenue 
        : order.totalAmount !== undefined 
          ? order.totalAmount * 0.8 
          : (vendorData.hourlyRate || 0) * 0.8;

      csvContent.push([
        order._id,
        order.name,
        order.email,
        order.phone,
        order.address,
        order.date,
        order.paymentMethod || 'Pay on Arrival',
        order.hoursWorked || 1,
        (order.totalAmount || vendorData.hourlyRate || 0).toFixed(2),
        revenue.toFixed(2),
        order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'N/A',
        order.notes || ''
      ]);
    });

    // Convert array to CSV string, properly handling commas and quotes
    return csvContent.map(row => 
      row.map(cell => {
        // Convert to string and handle null/undefined
        const value = cell?.toString() || '';
        // If the value contains commas, quotes, or newlines, wrap it in quotes
        return value.includes(',') || value.includes('"') || value.includes('\n') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    ).join('\n');
  };

  const downloadReport = (content) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vendor-revenue-report-${vendorData.name}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchRevenueData();
    // eslint-disable-next-line
  }, [vendorData, backendUrl]);

  if (vendorLoading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-4">Revenue Dashboard</h2>
        <div className="text-gray-600">Loading vendor data...</div>
      </div>
    );
  }

  if (!vendorData?._id) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-4">Revenue Dashboard</h2>
        <div className="text-red-600">Please log in to view revenue data.</div>
      </div>
    );
  }

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
          disabled={generatingReport || revenueData.totalOrders === 0}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
            generatingReport || revenueData.totalOrders === 0
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-green-800">Rs. {revenueData.totalRevenue.toFixed(2)}</p>
              <p className="text-green-600 text-xs mt-1">Your 80% share</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Completed Orders</p>
              <p className="text-3xl font-bold text-blue-800">{revenueData.totalOrders}</p>
              <p className="text-blue-600 text-xs mt-1">Total services completed</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Platform Fees</p>
              <p className="text-3xl font-bold text-orange-800">Rs. {revenueData.totalServiceFees.toFixed(2)}</p>
              <p className="text-orange-600 text-xs mt-1">20% service charges</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Gross Revenue (100%)</span>
            <span className="font-semibold">Rs. {(revenueData.totalRevenue + revenueData.totalServiceFees).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-green-600">Your Share (80%)</span>
            <span className="font-semibold text-green-600">Rs. {revenueData.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-orange-600">Platform Fee (20%)</span>
            <span className="font-semibold text-orange-600">Rs. {revenueData.totalServiceFees.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Recent Completed Orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Completed Orders</h3>
        {revenueData.recentOrders.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No completed orders yet.</div>
        ) : (
          <div className="space-y-4">
            {revenueData.recentOrders.map(order => (
              <div key={order._id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{order.name}</div>
                    <div className="text-sm text-gray-600">{order.email}</div>
                    <div className="text-sm text-gray-500">Service Date: {order.date}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Payment: {order.paymentMethod === 'Card Payment' ? '💳 Card' : '💰 Cash'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+Rs. {(order.vendorRevenue || 0).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Revenue;