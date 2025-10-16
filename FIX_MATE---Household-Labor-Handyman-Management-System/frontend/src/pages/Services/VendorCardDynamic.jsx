
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../Context/AppContext';

const VendorCardDynamic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, isLoggedin, backendUrl } = useContext(AppContext);

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [deletingReview, setDeletingReview] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${backendUrl}/api/vendor/category/vendor/${id}`);
        if (data.success && data.vendor) setVendor(data.vendor);
        else setError(data.message || 'Vendor not found');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch vendor');
      } finally {
        setLoading(false);
      }
    };

    const fetchVendorReviews = async () => {
      setReviewsLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/vendor-reviews/vendor/${id}`);
        if (data.success) setReviews(data.reviews || []);
      } catch (err) {
        console.error('Failed to fetch vendor reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchVendor();
    fetchVendorReviews();
  }, [id, backendUrl]);

  const images = useMemo(() => {
    return vendor && vendor.galleryImages && vendor.galleryImages.length > 0
      ? vendor.galleryImages
      : vendor && vendor.profileImageUrl
      ? [vendor.profileImageUrl]
      : [];
  }, [vendor]);

  const [thumbnail, setThumbnail] = useState('');
  useEffect(() => {
    if (images.length > 0) setThumbnail(images[0]);
  }, [images]);

  const handleBookingClick = () => {
    if (!isLoggedin) {
      toast.error('Please log in to book a service');
      return;
    }
    navigate('/service-booking', { state: { vendor } });
  };

  const refreshReviews = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/vendor-reviews/vendor/${id}`);
      if (data.success) setReviews(data.reviews || []);
    } catch (err) {
      console.error('Failed to refresh reviews', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedin) return toast.error('Please log in to submit a review');
    if (reviewForm.rating === 0) return toast.error('Please select a rating');
    if (!reviewForm.comment.trim()) return toast.error('Please write a comment');

    setSubmittingReview(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/vendor-reviews/add`,
        { vendorId: id, rating: reviewForm.rating, comment: reviewForm.comment },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Review submitted successfully!');
        setReviewForm({ rating: 0, comment: '' });
        await refreshReviews();
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleEditSubmit = async (reviewId) => {
    if (editForm.rating === 0) return toast.error('Please select a rating');
    if (!editForm.comment.trim()) return toast.error('Please write a comment');

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/vendor-reviews/${reviewId}`,
        { rating: editForm.rating, comment: editForm.comment },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Review updated successfully');
        setEditingReview(null);
        await refreshReviews();
      } else {
        toast.error(data.message || 'Failed to update review');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setDeletingReview(reviewId);
    try {
      const { data } = await axios.delete(`${backendUrl}/api/vendor-reviews/${reviewId}`, { withCredentials: true });
      if (data.success) {
        toast.success('Review deleted successfully');
        await refreshReviews();
      } else {
        toast.error(data.message || 'Failed to delete review');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setDeletingReview(null);
    }
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${
            interactive ? 'hover:text-yellow-400' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!vendor) return null;

  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 flex flex-col sm:flex-row items-center gap-6">
              <img src={vendor.profileImageUrl || '/default-profile.png'} alt={vendor.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{vendor.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">{vendor.category}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Hourly Rate: Rs.{vendor.hourlyRate}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm">4.0 (120 reviews)</span>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col lg:flex-row gap-8">
              <div className="flex flex-row gap-6 w-full lg:w-2/3">
                <div className="flex flex-col gap-2 items-center">
                  {images.filter(Boolean).map((image, index) => (
                    <div key={index} onClick={() => setThumbnail(image)} className={`w-16 h-16 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${thumbnail === image ? 'border-indigo-500' : 'border-gray-300 hover:border-gray-400'}`}>
                      <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 border-2 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center min-w-[250px] min-h-[250px]">
                  {thumbnail ? <img src={thumbnail} alt="Selected" className="w-full h-80 object-cover" /> : null}
                </div>
              </div>

              <div className="lg:w-1/3 flex flex-col gap-6 justify-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Contact</h3>
                  <div className="space-y-1 text-gray-700">
                    <div><span className="font-medium">Phone:</span> {vendor.phone || 'N/A'}</div>
                    <div><span className="font-medium">Email:</span> {vendor.email || 'N/A'}</div>
                    <div><span className="font-medium">Address:</span> {vendor.address || 'N/A'}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <div className="text-gray-700">{vendor.description || 'No description provided.'}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button className="w-full sm:flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-black cursor-pointer" onClick={handleBookingClick}>Book Now</button>
                  <button className="w-full sm:flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 cursor-pointer">Call Now</button>
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-gray-200 px-8 py-6">
              <h3 className="text-xl font-bold mb-4">Reviews</h3>

              <div className="space-y-4 mb-8">
                {reviewsLoading ? (
                  <div className="text-gray-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-gray-500">No reviews yet. Be the first to review this vendor!</div>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                      {editingReview === review._id ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Your Rating:</span>
                            <StarRating rating={editForm.rating} onRatingChange={(rating) => setEditForm((p) => ({ ...p, rating }))} interactive />
                          </div>
                          <textarea value={editForm.comment} onChange={(e) => setEditForm((p) => ({ ...p, comment: e.target.value }))} className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[80px] resize-none" maxLength={500} />
                          <div className="text-xs text-gray-500 text-right">{editForm.comment.length}/500 characters</div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditSubmit(review._id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Save</button>
                            <button onClick={() => setEditingReview(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.userName}</span>
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                            {isLoggedin && userData && review.userId === userData._id && (
                              <div className="ml-auto flex gap-2">
                                <button onClick={() => handleEditReview(review)} className="text-blue-600 hover:text-blue-800 text-sm underline">Edit</button>
                                <button onClick={() => handleDeleteReview(review._id)} disabled={deletingReview === review._id} className="text-red-600 hover:text-red-800 text-sm underline disabled:opacity-50">{deletingReview === review._id ? 'Deleting...' : 'Delete'}</button>
                              </div>
                            )}
                          </div>
                          <div className="text-gray-700 text-sm">{review.comment}</div>

                          {review.vendorReply && review.vendorReply.replyText && (
                            <div className="mt-3 bg-gray-100 p-3 rounded">
                              <div className="text-sm font-semibold text-indigo-700">Reply from vendor</div>
                              <div className="text-sm text-gray-800 mt-1">{review.vendorReply.replyText}</div>
                              {review.vendorReply.repliedAt && <div className="text-xs text-gray-500 mt-2">{new Date(review.vendorReply.repliedAt).toLocaleString()}</div>}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              {isLoggedin ? (
                <div className="bg-gray-50 p-6 rounded-lg max-w-xl mx-auto mt-8">
                  <h4 className="text-lg font-semibold mb-4">Add a Review</h4>
                  <form className="flex flex-col gap-4" onSubmit={handleReviewSubmit}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Your Rating:</span>
                      <StarRating rating={reviewForm.rating} onRatingChange={(rating) => setReviewForm((p) => ({ ...p, rating }))} interactive />
                    </div>
                    <textarea placeholder="Write your review..." className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[100px] resize-none" value={reviewForm.comment} onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} maxLength={500} required />
                    <div className="text-xs text-gray-500 text-right">{reviewForm.comment.length}/500 characters</div>
                    <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={submittingReview}>{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg max-w-xl mx-auto mt-8 text-center"><p className="text-gray-600">Please log in to submit a review.</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VendorCardDynamic;
