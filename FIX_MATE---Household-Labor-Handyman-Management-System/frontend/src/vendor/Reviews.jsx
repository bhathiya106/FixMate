import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { VendorContext } from '../Context/VendorContext';

const VendorReviews = () => {
  const { vendorData, backendUrl } = useContext(VendorContext) || {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyEditing, setReplyEditing] = useState(null); // reviewId
  const [replyForm, setReplyForm] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      if (!vendorData || !vendorData._id) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/vendor-reviews/vendor/${vendorData._id}`);
        if (data && data.success) {
          setReviews(data.reviews || []);
        } else {
          setError(data.message || 'Failed to load reviews');
        }
      } catch (err) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [vendorData, backendUrl]);

  const handleStartReply = (review) => {
    setReplyEditing(review._id);
    setReplyForm(prev => ({ ...prev, [review._id]: review.vendorReply?.replyText || '' }));
  };

  const handleCancelReply = (reviewId) => {
    setReplyEditing(null);
    setReplyForm(prev => { const copy = { ...prev }; delete copy[reviewId]; return copy; });
  };

  const handleSaveReply = async (reviewId) => {
    const text = (replyForm[reviewId] || '').trim();
    if (!text) return alert('Reply cannot be empty');
    try {
      const { data } = await axios.post(`${backendUrl}/api/vendor-reviews/${reviewId}/reply`, { replyText: text }, { withCredentials: true });
      if (data && data.success) {
        // update local state
        setReviews(prev => prev.map(r => r._id === reviewId ? data.review : r));
        setReplyEditing(null);
      } else {
        alert(data.message || 'Failed to save reply');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Failed to save reply');
    }
  };

  const handleDeleteReply = async (reviewId) => {
    if (!window.confirm('Delete your reply?')) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/vendor-reviews/${reviewId}/reply`, { withCredentials: true });
      if (data && data.success) {
        setReviews(prev => prev.map(r => r._id === reviewId ? data.review : r));
        setReplyEditing(null);
      } else {
        alert(data.message || 'Failed to delete reply');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Failed to delete reply');
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {loading ? (
        <div>Loading reviews...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-300">You have no reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-gray-800 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                    {r.userName ? r.userName[0]?.toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-semibold">{r.userName || 'User'}</div>
                    <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-yellow-400 font-bold">{r.rating}</div>
                  <div className="text-sm text-gray-400">/5</div>
                </div>
              </div>
              <div className="text-gray-200">{r.comment}</div>
              {/* Vendor reply display */}
              <div className="mt-3">
                {r.vendorReply && r.vendorReply.replyText ? (
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-indigo-200 font-semibold">Reply from you</div>
                        <div className="text-sm text-gray-200 mt-1">{r.vendorReply.replyText}</div>
                        <div className="text-xs text-gray-400 mt-2">{r.vendorReply.repliedAt ? new Date(r.vendorReply.repliedAt).toLocaleString() : ''}</div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button onClick={() => handleStartReply(r)} className="text-xs underline text-indigo-300">Edit Reply</button>
                        <button onClick={() => handleDeleteReply(r._id)} className="text-xs underline text-red-400">Delete Reply</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <button onClick={() => handleStartReply(r)} className="text-sm text-indigo-300 underline">Reply</button>
                  </div>
                )}

                {replyEditing === r._id && (
                  <div className="mt-3">
                    <textarea
                      value={replyForm[r._id] || ''}
                      onChange={(e) => setReplyForm(prev => ({ ...prev, [r._id]: e.target.value }))}
                      className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-sm"
                      rows={4}
                      maxLength={1000}
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleSaveReply(r._id)} className="px-3 py-1 bg-green-600 rounded text-sm">Save Reply</button>
                      <button onClick={() => handleCancelReply(r._id)} className="px-3 py-1 bg-gray-600 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorReviews;
