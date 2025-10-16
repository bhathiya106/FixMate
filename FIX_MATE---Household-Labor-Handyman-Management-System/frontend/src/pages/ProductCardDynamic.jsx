import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Banner from '../components/Banner/Banner';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';

const ProductCardDynamic = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isLoggedin, backendUrl, userData } = useContext(AppContext);


  const navigate = useNavigate();
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Edit/delete states
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [deletingReview, setDeletingReview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`/api/supplier/${id}`);
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setError(data.message || 'Product not found');
        }
      } catch {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchProductReviews = async () => {
      setReviewsLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/reviews/product/${id}`);
        console.log('Reviews response:', data); // Debug log
        if (data.success) {
          setReviews(data.reviews || []);
        } else {
          console.log('Failed to fetch reviews:', data.message);
          setReviews([]);
        }
      } catch (error) {
        console.log('Failed to fetch reviews:', error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    fetchProduct();
    fetchProductReviews();
  }, [id, backendUrl]);

  const handleGoToBooking = () => {
    if (!isLoggedin) {
      toast.error('You must be logged in to book.');
      return;
    }
    // Pass product info to booking page
    navigate('/booking', { state: { product } });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedin) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (reviewForm.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/reviews/add`,
        {
          productId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Review submitted');
        setReviewForm({ rating: 0, comment: '' });
        // Refresh reviews
        const reviewData = await axios.get(`${backendUrl}/api/reviews/product/${id}`);
        if (reviewData.data.success) {
          setReviews(reviewData.data.reviews);
        }
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleEditSubmit = async (reviewId) => {
    if (editForm.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!editForm.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/reviews/${reviewId}`,
        {
          rating: editForm.rating,
          comment: editForm.comment
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Review updated successfully');
        setEditingReview(null);
        // Refresh reviews
        const reviewData = await axios.get(`${backendUrl}/api/reviews/product/${id}`);
        if (reviewData.data.success) {
          setReviews(reviewData.data.reviews);
        }
      } else {
        toast.error(data.message || 'Failed to update review');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeletingReview(reviewId);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/reviews/${reviewId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Review deleted successfully');
        // Refresh reviews
        const reviewData = await axios.get(`${backendUrl}/api/reviews/product/${id}`);
        if (reviewData.data.success) {
          setReviews(reviewData.data.reviews);
        }
      } else {
        toast.error(data.message || 'Failed to delete review');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    } finally {
      setDeletingReview(null);
    }
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 flex flex-col sm:flex-row items-center gap-6">
              <img
                src={product.imageUrl || assets.seller}
                alt={product.name}
                className="w-full max-w-[420px] h-[340px] sm:h-[400px] object-cover rounded-2xl border-4 border-white shadow-lg"
              />
              <div className="flex-1 w-full">
                <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">${product.price} per item</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Supplier: {product.supplier?.businessName || product.supplier?.name}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-white font-semibold">{product.supplier?.location || 'Location not set'}</span>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50/80 p-4 rounded-lg text-gray-900">
                    <h3 className="text-lg font-semibold mb-2">Supplier Contact</h3>
                    <div className="space-y-1">
                      <div><span className="font-medium">Business Name:</span> {product.supplier?.businessName || product.supplier?.name || 'N/A'}</div>
                      <div><span className="font-medium">Location:</span> {product.supplier?.location || 'N/A'}</div>
                      <div><span className="font-medium">Email:</span> {product.supplier?.email || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg text-gray-900">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <div>{product.description || 'No description provided.'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-black cursor-pointer"
                    onClick={handleGoToBooking}
                  >
                    Book Now
                  </button>
                  <a
                    href={`mailto:${product.supplier?.email || ''}`}
                    className="w-full sm:flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 cursor-pointer text-center"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white border-t border-gray-200 px-8 py-6">
              <h3 className="text-xl font-bold mb-4">Reviews</h3>
              
              {/* Display Reviews */}
              <div className="space-y-4 mb-8">
                {reviewsLoading ? (
                  <div className="text-gray-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-gray-500">No reviews yet. Be the first to review this product!</div>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                      {editingReview === review._id ? (
                        // Edit form
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Your Rating:</span>
                            <StarRating 
                              rating={editForm.rating} 
                              onRatingChange={(rating) => setEditForm(prev => ({ ...prev, rating }))}
                              interactive={true}
                            />
                          </div>
                          <textarea
                            value={editForm.comment}
                            onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[80px] resize-none"
                            maxLength={500}
                          />
                          <div className="text-xs text-gray-500 text-right">
                            {editForm.comment.length}/500 characters
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSubmit(review._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingReview(null)}
                              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display mode
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.userName}</span>
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {/* Show edit/delete buttons only for user's own reviews */}

                            {isLoggedin && userData && String(review.userId) === String(userData._id) && (
                              <div className="ml-auto flex gap-2">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  disabled={deletingReview === review._id}
                                  className="text-red-600 hover:text-red-800 text-sm underline disabled:opacity-50"
                                >
                                  {deletingReview === review._id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="text-gray-700 text-sm">{review.comment}</div>

                          {/* Supplier reply (if any) */}
                          {review.supplierReply && review.supplierReply.replyText && (
                            <div className="mt-3 bg-indigo-50 border border-indigo-100 p-3 rounded">
                              <div className="text-sm text-indigo-700 font-semibold">Reply from supplier</div>
                              <div className="text-sm text-gray-700 mt-1">{review.supplierReply.replyText}</div>
                              <div className="text-xs text-gray-500 mt-2">{review.supplierReply.repliedAt ? new Date(review.supplierReply.repliedAt).toLocaleString() : ''}</div>
                            </div>
                          )}

                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {/* Add Review Form */}
              {isLoggedin ? (
                <div className="bg-gray-50 p-6 rounded-lg max-w-xl mx-auto mt-8">
                  <h4 className="text-lg font-semibold mb-4">Add a Review</h4>
                  <form className="flex flex-col gap-4" onSubmit={handleReviewSubmit}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Your Rating:</span>
                      <StarRating 
                        rating={reviewForm.rating} 
                        onRatingChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                        interactive={true}
                      />
                    </div>
                    <textarea
                      placeholder="Write your review..."
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[100px] resize-none"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      maxLength={500}
                      required
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {reviewForm.comment.length}/500 characters
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg max-w-xl mx-auto mt-8 text-center">
                  <p className="text-gray-600">Please log in to submit a review.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCardDynamic;
