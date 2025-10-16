import mongoose from 'mongoose';

const deliveryNoticeSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', required: true, index: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    createdBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

const DeliveryNotice = mongoose.model('DeliveryNotice', deliveryNoticeSchema);

export default DeliveryNotice;
