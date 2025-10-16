import mongoose from 'mongoose';

const vendorNoticeSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    createdBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

const VendorNotice = mongoose.model('VendorNotice', vendorNoticeSchema);

export default VendorNotice;
