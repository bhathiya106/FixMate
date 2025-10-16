// Update service order details
export const updateOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateFields = {};
    const allowedFields = ['address', 'notes', 'date'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, updateFields, { new: true });
    if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, vendorRevenue, serviceFee, totalAmount, hoursWorked } = req.body;
    
    if (!['pending', 'ongoing', 'done', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const updateData = { 
      status, 
      updatedAt: new Date() 
    };
    
    // If marking as done, save revenue data
    if (status === 'done') {
      if (vendorRevenue !== undefined) updateData.vendorRevenue = vendorRevenue;
      if (serviceFee !== undefined) updateData.serviceFee = serviceFee;
      if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
      if (hoursWorked !== undefined) updateData.hoursWorked = hoursWorked;
    }
    
    const order = await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
import orderModel from '../models/orderModel.js';

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const createOrder = async (req, res) => {
  try {
    const { vendorId, vendorName, userId, name, phone, email, address, date, notes, paymentMethod } = req.body;
    if (!vendorId || !userId || !name || !phone || !email || !address || !date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const order = new orderModel({ 
      vendorId, 
      vendorName, 
      userId, 
      name, 
      phone, 
      email, 
      address, 
      date, 
      notes,
      paymentMethod: paymentMethod || 'Pay on Arrival'
    });
    await order.save();
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await orderModel.find({ vendorId }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
