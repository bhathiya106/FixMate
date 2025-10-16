import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, isLoggedin } = useContext(AppContext);
  const product = location.state?.product;

  const [form, setForm] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
    address: userData?.address || '',
    date: '',
    notes: '',
    amount: 1
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">No product selected for booking.</div>;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isLoggedin || !userData) {
      toast.error('You must be logged in to book.');
      return;
    }
    // Validate required fields
    const requiredFields = [
      form.name,
      form.phone,
      form.email,
      form.address,
      form.date,
      product?._id,
      product?.name,
      product?.supplier?._id,
      userData._id || userData.id
    ];
    if (requiredFields.some(f => !f || f.toString().trim() === '')) {
      toast.error('Please fill all required fields.');
      return;
    }
    // Compose order data
    const orderData = {
      productId: product._id,
      productName: product.name,
      supplierId: product.supplier?._id,
      userId: userData._id || userData.id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      date: form.date,
      notes: form.notes,
      amount: form.amount,
      paymentMethod: 'Cash on Delivery'
    };
    try {
      await axios.post('/api/supply-orders', orderData);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        navigate(`/product/${product._id}`);
      }, 1800);
      toast.success('Your order has been placed.');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handlePaymentMethodSelect = (method) => {
    // Validate form first
    const requiredFields = [
      form.name,
      form.phone,
      form.email,
      form.address,
      form.date,
      product?._id,
      product?.name,
      product?.supplier?._id,
      userData._id || userData.id
    ];
    if (requiredFields.some(f => !f || f.toString().trim() === '')) {
      toast.error('Please fill all required fields.');
      return;
    }

    // Set payment method and show confirmation
    setSelectedPaymentMethod(method);
    setShowConfirmation(true);
  };

  const handleConfirmOrder = () => {
    if (selectedPaymentMethod === 'cash') {
      handlePlaceOrder(new Event('submit'));
    } else if (selectedPaymentMethod === 'online') {
      // Navigate to payment page with order data
      const orderData = {
        productId: product._id,
        productName: product.name,
        supplierId: product.supplier?._id,
        userId: userData._id || userData.id,
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        date: form.date,
        notes: form.notes,
        amount: form.amount,
        totalPrice: totalPrice
      };
      navigate('/payment', { state: { orderData, product } });
    }
    setShowConfirmation(false);
  };

  // Calculate total price
  const totalPrice = (Number(form.amount) > 0 ? Number(form.amount) : 1) * (Number(product.price) || 0);

  return (
    <div>
      <div className="min-h-screen py-8 flex flex-col items-center bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-12 mt-12">
          <button
            type="button"
            className="mb-6 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-semibold self-start"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <div className="mb-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-indigo-700">Book Product</h2>
            <div className="text-lg font-semibold text-gray-700">Item: <span className="text-black">{product.name}</span></div>
          </div>
          {bookingSuccess ? (
            <div className="text-green-600 text-center text-lg font-semibold py-8">Booking submitted!<br/>We will contact you soon.</div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-lg"
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
                  value={form.phone}
                  onChange={handleChange}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-lg"
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
                  value={form.email}
                  onChange={handleChange}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-lg"
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
                  value={form.address}
                  onChange={handleChange}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-lg"
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
                  value={form.date}
                  onChange={handleChange}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-lg"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="notes" className="font-medium text-gray-700">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[60px] text-lg"
                  placeholder="Additional notes (optional)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="amount" className="font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-lg"
                  placeholder="Amount"
                  min={1}
                  required
                />
                <span className="text-xs text-gray-500">(Enter quantity. Price per item: Rs.{product.price})</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="text-xl font-bold text-indigo-700">Total Price: <span className="text-green-600">Rs.{totalPrice}</span></div>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <div className="text-lg font-semibold text-gray-700 text-center">Choose Payment Method</div>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodSelect('cash')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg"
                >
                  Pay on Arrival (Cash)
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodSelect('online')}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg"
                >
                  Pay Now (Card)
                </button>
              </div>
            </form>
          )}
          
          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Confirm Your Order</h3>
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Order Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Product:</strong> {product.name}</div>
                      <div><strong>Quantity:</strong> {form.amount}</div>
                      <div><strong>Total:</strong> <span className="text-green-600 font-bold">${totalPrice}</span></div>
                      <div><strong>Delivery Date:</strong> {form.date}</div>
                      <div><strong>Payment Method:</strong> {selectedPaymentMethod === 'cash' ? 'Pay on Arrival (Cash)' : 'Pay Now (Card)'}</div>
                    </div>
                  </div>
                  <div className="text-center text-gray-600">
                    Are you sure you want to {selectedPaymentMethod === 'cash' ? 'place this order' : 'proceed to payment'}?
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
                    {selectedPaymentMethod === 'cash' ? 'Place Order' : 'Continue to Payment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
