import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
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
}, {
  timestamps: true
});


// Optional supplier reply subdocument
reviewSchema.add({
  supplierReply: {
    repliedBySupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    repliedBySupplierName: { type: String },
    replyText: { type: String, trim: true, maxlength: 1000 },
    repliedAt: { type: Date }
  }
});


// Ensure one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const reviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default reviewModel;