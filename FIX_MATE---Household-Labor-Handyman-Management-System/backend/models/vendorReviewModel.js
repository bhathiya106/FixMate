import mongoose from 'mongoose';

const vendorReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  userName: {
    type: String,
    required: true
  }

  ,
  vendorReply: {
    repliedByVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    repliedByVendorName: { type: String },
    replyText: { type: String, trim: true, maxlength: 1000 },
    repliedAt: { type: Date }
  }

}, {
  timestamps: true
});

// Ensure one review per user per vendor
vendorReviewSchema.index({ userId: 1, vendorId: 1 }, { unique: true });

const vendorReviewModel = mongoose.models.VendorReview || mongoose.model('VendorReview', vendorReviewSchema);

export default vendorReviewModel;