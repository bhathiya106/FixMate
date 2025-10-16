import mongoose from 'mongoose';

const supplierNoticeSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true, index: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    createdBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

const SupplierNotice = mongoose.model('SupplierNotice', supplierNoticeSchema);

export default SupplierNotice;
