import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const SupplierRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = React.useCallback((values) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const errs = {};
    if (!values.name || values.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';
    if (!values.email) errs.email = 'Email is required';
    else if (!emailRegex.test(values.email)) errs.email = 'Enter a valid email';
    if (!values.password) errs.password = 'Password is required';
    else if (values.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  }, []);

  React.useEffect(() => {
    setErrors(validate(form));
  }, [form, validate]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    const v = validate(form);
    if (Object.keys(v).length > 0) return;
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl + '/api/supplier/register',
        { name: form.name, email: form.email, password: form.password },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/supplierlogin');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Register as a Supplier
        </p>

  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {touched.name && errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
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
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={Object.keys(errors).length > 0 || isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2 ${
              (Object.keys(errors).length > 0 || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Registering...' : 'Register as Supplier'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/supplierlogin">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Sign in here
          </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SupplierRegister;
