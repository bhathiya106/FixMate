import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const VendorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // mark touched
    setTouched({ email: true, password: true });

    // quick validation
    const localErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) localErrors.email = 'Please enter a valid email';
    if (!form.password) localErrors.password = 'Please enter your password';
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) {
      toast.error('Please fix form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl + '/api/vendor/login',
        { email: form.email, password: form.password },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Login successful');
        navigate('/vendor');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.password) e.password = 'Please enter your password';
    setErrors(e);
    setFormIsValid(Object.keys(e).length === 0);
  }, [form.email, form.password]);

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-white px-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/')} 
          className="mb-3 text-blue-600 hover:underline flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          FixMate
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Welcome back! Sign in to your account
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your email"
              required
            />
            {touched.email && errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your password"
              required
            />
            {touched.password && errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between text-sm mt-1 mb-2">
            <button type="button" onClick={() => navigate('/reset-password?type=vendor')} className="text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={!formIsValid || isSubmitting}
            className={`w-full text-white py-2 rounded-lg font-semibold transition mt-2 ${(!formIsValid || isSubmitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/vendorregister">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Sign up here
          </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VendorLogin;
