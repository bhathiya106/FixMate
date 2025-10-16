import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const VendorRegister = () => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    hourlyRate: '',
    email: '',
    password: ''
  });
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
    setTouched({ name: true, category: true, hourlyRate: true, email: true, password: true });

    const localErrors = {};
    if (!form.name || form.name.trim().length < 3) localErrors.name = 'Name must be at least 3 characters';
    if (!form.category) localErrors.category = 'Please select a category';
    if (form.hourlyRate === '' || Number(form.hourlyRate) < 0) localErrors.hourlyRate = 'Please enter a valid hourly rate';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) localErrors.email = 'Please enter a valid email';
    if (!form.password || form.password.length < 8) localErrors.password = 'Password must be at least 8 characters';
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) {
      toast.error('Please fix form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl + '/api/vendor/register',
        {
          name: form.name,
          category: form.category,
          hourlyRate: form.hourlyRate,
          email: form.email,
          password: form.password
        },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/vendorlogin');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const e = {};
    if (!form.name || form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!form.category) e.category = 'Please select a category';
    if (form.hourlyRate === '' || Number(form.hourlyRate) < 0) e.hourlyRate = 'Please enter a valid hourly rate';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    setFormIsValid(Object.keys(e).length === 0);
  }, [form.name, form.category, form.hourlyRate, form.email, form.password]);

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
          Register as a Service Vendor
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your full name"
              required
            />
            {touched.name && errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              onBlur={() => handleBlur('category')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select a category</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Painter">Painter</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Gardener">Gardener</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Security">Security</option>
              <option value="PestControl">Pest Control Specialist</option>
              <option value="Mason">Mason</option>
            </select>
            {touched.category && errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Hourly Rate (USD)</label>
            <input
              type="number"
              name="hourlyRate"
              min="0"
              value={form.hourlyRate}
              onChange={handleChange}
              onBlur={() => handleBlur('hourlyRate')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your hourly rate"
              required
            />
            {touched.hourlyRate && errors.hourlyRate && <p className="text-sm text-red-500 mt-1">{errors.hourlyRate}</p>}
          </div>

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

          <button
            type="submit"
            disabled={!formIsValid || isSubmitting}
            className={`w-full text-white py-2 rounded-lg font-semibold transition mt-2 ${(!formIsValid || isSubmitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Registering...' : 'Register as Vendor'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/vendorlogin">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Sign in here
          </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorRegister;
