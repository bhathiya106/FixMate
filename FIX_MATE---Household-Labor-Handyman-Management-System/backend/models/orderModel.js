import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendors', required: true },
  vendorName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String },
  paymentMethod: { type: String, default: 'Pay on Arrival' },
  totalAmount: { type: Number },
  vendorRevenue: { type: Number },
  serviceFee: { type: Number },
  hoursWorked: { type: Number },
  status: { type: String, enum: ['pending', 'ongoing', 'done', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const orderModel = mongoose.models.order || mongoose.model('orders', orderSchema);

export default orderModel;
