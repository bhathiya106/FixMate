import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Footer from '../components/Footer/Footer';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card brand icons
const getCardBrandIcon = (brand) => {
  const brandIcons = {
    visa: '💳 Visa',
    mastercard: '💳 Mastercard',
    amex: '💳 American Express',
    discover: '💳 Discover',
    diners: '💳 Diners Club',
    jcb: '💳 JCB',
    unionpay: '💳 UnionPay',
    unknown: '💳 Card'
  };
  return brandIcons[brand] || brandIcons.unknown;
};

const PaymentForm = ({ orderData, product, vendor, totalPrice, isServiceBooking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [cardholderName, setCardholderName] = useState(orderData.name || '');
  const [cardBrand, setCardBrand] = useState('');
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/payment/create-payment-intent`,
          {
            amount: totalPrice,
            currency: 'usd',
            orderData: {
              orderId: Date.now().toString(),
              userId: orderData.userId,
              ...(isServiceBooking ? {
                vendorId: orderData.vendorId,
                vendorName: orderData.vendorName,
                serviceType: orderData.serviceType
              } : {
                productId: orderData.productId,
                productName: orderData.productName
              })
            }
          },
          { withCredentials: true }
        );

        if (data.success) {
          setClientSecret(data.clientSecret);
          setPaymentError(''); 
        } else {
          toast.error(data.message || 'Failed to initialize payment');
        }
      } catch (error) {
        console.error('Payment intent creation error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
        setPaymentError(errorMessage);
        toast.error(errorMessage);
      }
    };

    // Only create payment intent if we have the required data
    if (backendUrl && totalPrice && orderData) {
      createPaymentIntent();
    }
  }, [backendUrl, totalPrice, orderData, isServiceBooking, vendor, product]);

  const handleCardChange = (event) => {
    if (event.elementType === 'cardNumber') {
      setCardBrand(event.brand || '');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    // Validate cardholder name
    if (!cardholderName.trim()) {
      setPaymentError('Please enter cardholder name');
      return;
    }

    // Show confirmation dialog
    setShowPaymentConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    setShowPaymentConfirmation(false);
    setProcessing(true);
    setPaymentError('');

    const cardNumberElement = elements.getElement(CardNumberElement);

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: cardholderName,
          email: orderData.email,
        },
      },
    });

    if (error) {
      console.error('Payment confirmation error:', error);
      
      // Check if it's a payment intent error and suggest refresh
      if (error.code === 'resource_missing' && error.message.includes('payment_intent')) {
        setPaymentError('Payment session expired. Please refresh the page and try again.');
        toast.error('Payment session expired. Please refresh the page and try again.');
      } else {
        setPaymentError(error.message);
        toast.error(error.message);
      }
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment successful - now place the order
      try {
        if (isServiceBooking) {
          // Create service order
          await axios.post('/api/orders', {
            ...orderData,
            paymentMethod: 'Card Payment',
            paymentIntentId: paymentIntent.id,
            paymentStatus: 'paid'
          });
          
          toast.success('Payment successful! Your service booking has been placed.');
          navigate(`/services/category/vendor/${vendor._id}`);
        } else {
          // Create product order
          const orderDataWithPayment = {
            ...orderData,
            paymentMethod: 'Card Payment',
            paymentIntentId: paymentIntent.id,
            paymentStatus: 'paid'
          };

          await axios.post('/api/supply-orders', orderDataWithPayment);
          
          toast.success('Payment successful! Your order has been placed.');
          navigate(`/product/${product._id}`);
        }
      } catch (orderError) {
        console.error('Order creation error:', orderError);
        toast.error('Payment succeeded but failed to create order. Please contact support.');
      }
    }
    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8">
      <div className="mb-6">
        <button
          type="button"
          className="mb-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-semibold"
          onClick={() => navigate(-1)}
        >
          ← Back to Booking
        </button>
        <h2 className="text-3xl font-bold mb-2 text-indigo-700">Complete Payment</h2>
        <div className="text-lg text-gray-700">
          {isServiceBooking ? (
            <>
              <div><strong>Service Provider:</strong> {vendor.name}</div>
              <div><strong>Service Category:</strong> {vendor.category}</div>
              <div><strong>Hourly Rate:</strong> Rs.{vendor.hourlyRate}</div>
              <div><strong>Total Amount:</strong> <span className="text-green-600 font-bold">Rs.{totalPrice}</span></div>
            </>
          ) : (
            <>
              <div><strong>Product:</strong> {product.name}</div>
                            <div><strong>Amount:</strong> {orderData.amount} × Rs.{product.price} = <span className="text-green-600 font-bold">Rs.{totalPrice}</span></div>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Information</h3>
          
          {/* Cardholder Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter cardholder name"
              required
            />
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number {cardBrand && <span className="text-blue-600">({getCardBrandIcon(cardBrand)})</span>}
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <CardNumberElement 
                options={cardElementOptions} 
                onChange={handleCardChange}
              />
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div className="p-3 border border-gray-300 rounded-lg bg-white">
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <div className="p-3 border border-gray-300 rounded-lg bg-white">
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{paymentError}</span>
              {paymentError.includes('payment_intent') && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="ml-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div><strong>Name:</strong> {orderData.name}</div>
              <div><strong>Email:</strong> {orderData.email}</div>
              <div><strong>Phone:</strong> {orderData.phone}</div>
              <div><strong>Date:</strong> {orderData.date}</div>
              {orderData.notes && <div><strong>Notes:</strong> {orderData.notes}</div>}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">{isServiceBooking ? 'Service Information' : 'Delivery Information'}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div><strong>Address:</strong> {orderData.address}</div>
              {isServiceBooking ? (
                <>
                  <div><strong>Service Provider:</strong> {vendor.name}</div>
                  <div><strong>Category:</strong> {vendor.category}</div>
                  <div><strong>Hourly Rate:</strong> Rs. {vendor.hourlyRate}</div>
                </>
              ) : (
                <>
                  <div><strong>Product:</strong> {product.name}</div>
                  <div><strong>Quantity:</strong> {orderData.amount}</div>
                  <div><strong>Unit Price:</strong> Rs. {product.price}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Review and Pay Rs. ${totalPrice}`}
        </button>
      </form>

      {/* Payment Confirmation Modal */}
      {showPaymentConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Confirm Payment</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Payment Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {isServiceBooking ? (
                    <>
                      <div><strong>Service Provider:</strong> {vendor.name}</div>
                      <div><strong>Category:</strong> {vendor.category}</div>
                      <div><strong>Service Date:</strong> {orderData.date}</div>
                    </>
                  ) : (
                    <>
                      <div><strong>Product:</strong> {product.name}</div>
                      <div><strong>Quantity:</strong> {orderData.amount}</div>
                    </>
                  )}
                      <div><strong>Amount to Pay:</strong> <span className="text-green-600 font-bold text-lg">Rs. {totalPrice}</span></div>
                      <div><strong>Payment Method:</strong> Card ({cardBrand ? getCardBrandIcon(cardBrand) : '💳 Card'})</div>
                      <div><strong>Cardholder:</strong> {cardholderName}</div>
                </div>
              </div>
              <div className="text-center text-gray-600">
                Are you sure you want to process this payment?
              </div>
              <div className="text-xs text-center text-gray-500">
                Your card will be charged immediately.
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentConfirmation(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={processing}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div>🔒 Your payment information is secure and encrypted</div>
        <div>Powered by Stripe</div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const { orderData, product, vendor, isServiceBooking } = location.state || {};

    if (!orderData || (!product && !vendor)) {
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center text-red-500">
          No order data found. Please go back and try again.
        </div>
        <Footer />
      </div>
    );
  }  const totalPrice = isServiceBooking ? vendor.hourlyRate : orderData.totalPrice;

  return (
    <div>
      <div className="min-h-screen py-8 flex flex-col items-center bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="mt-12">
          <Elements stripe={stripePromise}>
            <PaymentForm 
              orderData={orderData} 
              product={product}
              vendor={vendor}
              totalPrice={totalPrice}
              isServiceBooking={isServiceBooking}
            />
          </Elements>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;