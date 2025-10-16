import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Banner from '../components/Banner/Banner';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`/api/product/${id}`);
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
    fetchProduct();
  }, [id]);

  const handleBookingChange = e => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async e => {
    e.preventDefault();
    // Implement booking logic here (e.g., send to backend)
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBooking(false);
      setBookingSuccess(false);
      setBookingForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        date: '',
        notes: ''
      });
    }, 1800);
    toast.success('Your order has been placed.');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div>
      <Banner title={product.name} bgImage={assets.banner2} />
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row gap-8 p-8">
            <div className="flex-1 flex flex-col items-center">
              <img
                src={product.imageUrl || assets.seller}
                alt={product.name}
                className="w-80 h-80 object-cover rounded-xl border-2 border-gray-200 mb-4"
              />
              <div className="text-lg font-bold text-indigo-600 mb-2">Rs.{product.price} per item</div>
              <div className="text-gray-700 text-sm mb-2">{product.description}</div>
            </div>
            <div className="flex-1 flex flex-col gap-6 justify-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Supplier Contact</h3>
                <div className="space-y-1 text-gray-700">
                  <div><span className="font-medium">Business Name:</span> {product.supplier?.businessName || product.supplier?.name || 'N/A'}</div>
                  <div><span className="font-medium">Location:</span> {product.supplier?.location || 'N/A'}</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  className="w-full sm:flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-black cursor-pointer"
                  onClick={() => setShowBooking(true)}
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
              {/* Booking Modal */}
              {showBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl font-bold"
                      onClick={() => setShowBooking(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Book {product.name}</h2>
                    {bookingSuccess ? (
                      <div className="text-green-600 text-center text-lg font-semibold py-8">Booking submitted!<br/>We will contact you soon.</div>
                    ) : (
                      <form className="flex flex-col gap-4" onSubmit={handleBookingSubmit}>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="name" className="font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={bookingForm.name}
                            onChange={handleBookingChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="Your Name"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="phone" className="font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={bookingForm.phone}
                            onChange={handleBookingChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="Phone Number"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="email" className="font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={bookingForm.email}
                            onChange={handleBookingChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="Email Address"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="address" className="font-medium text-gray-700">Address</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={bookingForm.address}
                            onChange={handleBookingChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="Delivery Address"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="date" className="font-medium text-gray-700">Date</label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={bookingForm.date}
                            onChange={handleBookingChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="notes" className="font-medium text-gray-700">Additional Notes</label>
                          <textarea
                            id="notes"
                            name="notes"
                            value={bookingForm.notes}
                            onChange={handleBookingChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[60px]"
                            placeholder="Additional notes (optional)"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2"
                        >
                          Submit Booking
                        </button>
                      </form>
                    )}
                  </div>
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

export default ProductDetail;
