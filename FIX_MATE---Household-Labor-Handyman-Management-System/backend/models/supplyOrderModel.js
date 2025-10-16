import mongoose from 'mongoose';

const supplyOrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products', // match productModel registration
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'suppliers', // match supplierModel registration
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // match userModel registration
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Card Payment'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Waiting for Delivery', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  // Delivery-related fields
  assignedDeliveryDriver: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery'
    },
    name: String,
    phone: String
  },
  deliveryAssignedAt: {
    type: Date
  },
  deliveryAcceptedAt: {
    type: Date
  },
  deliveryStartedAt: {
    type: Date
  },
  deliveryCompletedAt: {
    type: Date
  },
  totalAmount: {
    type: Number
  },
  supplierRevenue: {
    type: Number
  },
  serviceFee: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const SupplyOrder = mongoose.model('SupplyOrder', supplyOrderSchema);
export default SupplyOrder;
