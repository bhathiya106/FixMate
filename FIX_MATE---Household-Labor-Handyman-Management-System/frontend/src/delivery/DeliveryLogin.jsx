import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const DeliveryLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = useCallback((values) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errs = {};
    if (!values.email) errs.email = 'Email is required';
    else if (!emailRegex.test(values.email)) errs.email = 'Enter a valid email';
    if (!values.password) errs.password = 'Password is required';
    else if (values.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  }, []);

  useEffect(() => {
    const v = validate(form);
    setErrors(v);
    setFormIsValid(Object.keys(v).length === 0);
  }, [form, validate]);

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const v = validate(form);
    if (Object.keys(v).length > 0) return;
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl + '/api/delivery/login',
        { email: form.email, password: form.password },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Login successful');
        navigate('/delivery');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-300 to-white px-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/')} 
          className="mb-3 text-green-600 hover:underline flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-2">
          FixMate
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Welcome back! Sign in to your delivery account
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200 ${
                touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {touched.email && errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200 ${
                touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm mt-1 mb-2">
            <button type="button" onClick={() => navigate('/reset-password?type=delivery')} className="text-green-600 hover:underline cursor-pointer">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={!formIsValid || isSubmitting}
            className={`w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition mt-2 ${
              (!formIsValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/deliveryregister">
          <span className="text-green-600 hover:underline cursor-pointer">
            Sign up here
          </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DeliveryLogin;
