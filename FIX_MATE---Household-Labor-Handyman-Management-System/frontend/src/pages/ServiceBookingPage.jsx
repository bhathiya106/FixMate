import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';

const ServiceBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendor } = location.state || {};
  const { userData, isLoggedin, backendUrl } = useContext(AppContext);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    notes: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [dateError, setDateError] = useState('');

  // Set form data from user data when component mounts
  useEffect(() => {
    if (isLoggedin && userData) {
      setBookingForm({
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        address: userData.address || '',
        date: '',
        notes: ''
      });
    }
  }, [isLoggedin, userData]);

  // Fetch vendor orders to determine blocked dates (pending or ongoing)
  useEffect(() => {
    const fetchBlockedDates = async () => {
      if (!vendor || !backendUrl) return;
      try {
        const { data } = await axios.get(`${backendUrl}/api/orders/vendor/${vendor._id}`);
        if (data && data.success && Array.isArray(data.orders)) {
          const blocked = data.orders
            .filter(o => o.status === 'pending' || o.status === 'ongoing')
            .map(o => {
              // normalize to yyyy-mm-dd
              try {
                return new Date(o.date).toISOString().split('T')[0];
              } catch {
                return String(o.date).split('T')[0];
              }
            })
            .filter(Boolean);
          setBlockedDates(Array.from(new Set(blocked)));
        }
      } catch {
        // silently ignore
        setBlockedDates([]);
      }
    };

    fetchBlockedDates();
  }, [vendor, backendUrl]);

  if (!vendor) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-red-500">
          No vendor data found. Please go back and try again.
        </div>
        <Footer />
      </div>
    );
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({ ...bookingForm, [name]: value });

    // Validate selected date against blocked dates
    if (name === 'date') {
      const norm = value;
      if (blockedDates.includes(norm)) {
        setDateError('Selected date is unavailable. Please choose another day.');
      } else {
        setDateError('');
      }
    }
  };

  const handlePaymentMethodSelect = (method) => {
    if (method === 'pay-on-arrival') {
      setShowConfirmation(true);
    } else if (method === 'pay-now') {
      // Navigate to payment page with vendor service booking data
      const serviceOrderData = {
        vendorId: vendor._id,
        vendorName: vendor.name,
        userId: userData._id || userData.id,
        name: bookingForm.name,
        phone: bookingForm.phone,
        email: bookingForm.email,
        address: bookingForm.address,
        date: bookingForm.date,
        notes: bookingForm.notes,
        hourlyRate: vendor.hourlyRate,
        serviceType: 'vendor-service'
      };

      navigate('/payment', {
        state: {
          orderData: serviceOrderData,
          vendor: vendor,
          isServiceBooking: true
        }
      });
    }
  };

  const handleConfirmOrder = async () => {
    setShowConfirmation(false);

    try {
      await axios.post('/api/orders', {
        vendorId: vendor._id,
        vendorName: vendor.name,
        userId: userData._id || userData.id,
        name: bookingForm.name,
        phone: bookingForm.phone,
        email: bookingForm.email,
        address: bookingForm.address,
        date: bookingForm.date,
        notes: bookingForm.notes,
        paymentMethod: 'Pay on Arrival'
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate(`/services/category/vendor/${vendor._id}`);
      }, 2000);
      toast.success('Your service booking has been placed successfully!');
    } catch {
      toast.error('Failed to place booking. Please try again.');
    }
  };

  const validateForm = () => {
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.email || 
        !bookingForm.address || !bookingForm.date) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!isLoggedin) {
      toast.error('Please log in to book a service');
      return false;
    }

    // Prevent booking on blocked dates
    if (blockedDates.includes(bookingForm.date)) {
      toast.error('The selected date is unavailable. Please pick a different date.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show payment method selection
    const paymentSection = document.getElementById('payment-methods');
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (bookingSuccess) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-green-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
            <p className="text-lg text-gray-700 mb-4">
              Your service booking with {vendor.name} has been placed successfully.
            </p>
            <p className="text-gray-600">
              We will contact you soon to confirm the details.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <button
              type="button"
              className="mb-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-semibold"
              onClick={() => navigate(-1)}
            >
              ← Back to Vendor Details
            </button>
            
            <div className="flex items-center gap-6">
              <img
                src={vendor.profileImageUrl || '/default-profile.png'}
                alt={vendor.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Book Service with {vendor.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                    {vendor.category}
                  </span>
                  <span className="font-semibold">
                    Hourly Rate: ${vendor.hourlyRate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {dateError && (
                    <div className="text-sm text-red-500 mt-2">{dateError}</div>
                  )}
                  {blockedDates.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                      Unavailable dates: {blockedDates.join(', ')}
                    </div>
                  )}

                  {/* Simple 30-day calendar grid for quick selection */}
                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">Quick calendar (next 30 days)</div>
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const days = [];
                        const today = new Date();
                        for (let i = 0; i < 30; i++) {
                          const d = new Date(today);
                          d.setDate(today.getDate() + i);
                          const iso = d.toISOString().split('T')[0];
                          const isBlocked = blockedDates.includes(iso);
                          const isSelected = bookingForm.date === iso;
                          days.push(
                            <button
                              key={iso}
                              type="button"
                              onClick={() => {
                                if (isBlocked) return;
                                setBookingForm(prev => ({ ...prev, date: iso }));
                                setDateError('');
                              }}
                              disabled={isBlocked}
                              className={`text-xs p-2 rounded-lg w-full transition-colors border ${isBlocked ? 'bg-red-100 text-red-700 border-red-200 cursor-not-allowed' : isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-800 hover:bg-indigo-50'} `}
                            >
                              <div className="font-semibold">{d.getDate()}</div>
                              <div className="text-[10px]">{d.toLocaleString(undefined, { weekday: 'short' })}</div>
                            </button>
                          );
                        }
                        return days;
                      })()}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Red = unavailable • Click a date to select it</div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={bookingForm.address}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter the address where service is needed"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={bookingForm.notes}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                  placeholder="Any specific requirements or notes about the service..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-lg transition"
                disabled={!isLoggedin}
              >
                {isLoggedin ? 'Continue to Payment Options' : 'Login to Book Service'}
              </button>
            </form>
          </div>

          {/* Payment Methods Section */}
          <div id="payment-methods" className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Payment Method</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pay on Arrival */}
              <div 
                className="border-2 border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                onClick={() => handlePaymentMethodSelect('pay-on-arrival')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Pay on Arrival</h3>
                  <p className="text-gray-600 mb-4">
                    Pay when the service provider arrives at your location
                  </p>
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Cash or Card on Site
                  </div>
                </div>
              </div>

              {/* Pay Now */}
              <div 
                className="border-2 border-gray-300 rounded-xl p-6 cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                onClick={() => handlePaymentMethodSelect('pay-now')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">💳</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Pay Now</h3>
                  <p className="text-gray-600 mb-4">
                    Pay securely online with your credit or debit card
                  </p>
                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Secure Online Payment
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
              Choose your preferred payment method to complete the booking
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Confirm Your Booking</h3>
            
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Booking Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Service Provider:</strong> {vendor.name}</div>
                  <div><strong>Category:</strong> {vendor.category}</div>
                  <div><strong>Date:</strong> {bookingForm.date}</div>
                  <div><strong>Address:</strong> {bookingForm.address}</div>
                  <div><strong>Hourly Rate:</strong> Rs.{vendor.hourlyRate}</div>
                  <div><strong>Payment Method:</strong> Pay on Arrival</div>
                </div>
              </div>
              
              <div className="text-center text-gray-600">
                Are you sure you want to place this booking?
              </div>
              <div className="text-xs text-center text-gray-500">
                The service provider will contact you to confirm the details.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

          <Footer />
        </div>
      );
    };

    export default ServiceBookingPage;