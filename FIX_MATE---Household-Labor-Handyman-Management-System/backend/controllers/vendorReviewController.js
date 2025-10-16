import vendorReviewModel from '../models/vendorReviewModel.js';
import userModel from '../models/userModel.js';
import vendorModel from '../models/vendorModel.js';

// Add a new vendor review
const addVendorReview = async (req, res) => {
  try {
    const { vendorId, rating, comment } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    // Validate input
    if (!vendorId || !rating || !comment) {
      return res.json({ success: false, message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Check if vendor exists
    const vendor = await vendorModel.findById(vendorId);
    if (!vendor) {
      return res.json({ success: false, message: 'Vendor not found' });
    }

    // Get user name
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Check if user already reviewed this vendor
    const existingReview = await vendorReviewModel.findOne({ userId, vendorId });
    if (existingReview) {
      return res.json({ success: false, message: 'You have already reviewed this vendor' });
    }

    // Create new review
    const newReview = new vendorReviewModel({
      userId,
      vendorId,
      rating: Number(rating),
      comment: comment.trim(),
      userName: user.name
    });

    await newReview.save();

    res.json({ success: true, message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get reviews for a vendor
const getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const reviews = await vendorReviewModel.find({ vendorId })
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's vendor reviews
const getUserVendorReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await vendorReviewModel.find({ userId })
      .populate('vendorId', 'name profileImageUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Edit a vendor review
const editVendorReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    // Validate input
    if (!rating || !comment) {
      return res.json({ success: false, message: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const review = await vendorReviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Not authorized to edit this review' });
    }

    // Update the review
    review.rating = Number(rating);
    review.comment = comment.trim();
    await review.save();

    res.json({ success: true, message: 'Review updated successfully', review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a vendor review
const deleteVendorReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id; // Get userId from authenticated user

    const review = await vendorReviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Not authorized to delete this review' });
    }

    await vendorReviewModel.findByIdAndDelete(reviewId);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Add or update a vendor reply to a review (vendor must be authenticated)
const addOrUpdateReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { replyText } = req.body;
    const vendorId = req.user.id; // vendorAuth should set req.user.id

    if (!replyText || !replyText.trim()) {
      return res.json({ success: false, message: 'Reply text is required' });
    }

    const review = await vendorReviewModel.findById(reviewId);
    if (!review) return res.json({ success: false, message: 'Review not found' });

    // verify the vendor owns the review's vendorId
    if (review.vendorId.toString() !== vendorId) {
      return res.json({ success: false, message: 'Not authorized to reply to this review' });
    }

    // update the vendorReply subdocument
    review.vendorReply = {
      repliedByVendorId: vendorId,
      repliedByVendorName: req.user.name || undefined,
      replyText: replyText.trim(),
      repliedAt: new Date()
    };

    await review.save();
    res.json({ success: true, message: 'Reply saved', review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a vendor reply (vendor must be authenticated)
const deleteReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const vendorId = req.user.id;

    const review = await vendorReviewModel.findById(reviewId);
    if (!review) return res.json({ success: false, message: 'Review not found' });

    if (review.vendorId.toString() !== vendorId) {
      return res.json({ success: false, message: 'Not authorized to delete this reply' });
    }

    review.vendorReply = undefined;
    await review.save();
    res.json({ success: true, message: 'Reply deleted', review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addVendorReview,
  getVendorReviews,
  getUserVendorReviews,
  editVendorReview,
  deleteVendorReview,
  addOrUpdateReply,
  deleteReply
};
