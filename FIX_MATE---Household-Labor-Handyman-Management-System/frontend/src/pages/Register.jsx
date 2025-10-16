import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios'

const Register = () => {

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // mark all fields touched so errors are visible
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    // validate before submitting
    const currentErrors = validateAll();
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      toast.error('Please fix form errors before submitting');
      return;
    }

    if (!formIsValid) {
      toast.error('Please fix form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      // First try to register
      const { data } = await axios.post(
        backendUrl + '/api/auth/register',
        { name, email, password },
        { withCredentials: true }
      );
      
      if (data.success) {
        // If registration is successful, attempt to log in automatically
        try {
          const loginData = await axios.post(
            backendUrl + '/api/auth/login',
            { email, password },
            { withCredentials: true }
          );
          
          if (loginData.data.success) {
            // Store the token
            localStorage.setItem('token', loginData.data.token);
            // Update login state
            setIsLoggedin(true);
            // Get user data
            await getUserData();
            toast.success('Registration successful!');
            navigate('/');
          }
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          toast.success('Registration successful! Please log in.');
          navigate('/signup');
        }
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // validation helpers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const validateAll = () => {
    const e = {};
    if (!name || name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!email || !emailRegex.test(email)) e.email = 'Please provide a valid email address';
    if (!password || !passwordRegex.test(password)) e.password = 'Password must be at least 8 characters and include uppercase, lowercase, number and special character';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  useEffect(() => {
    const e = validateAll();
    setErrors(e);
    setFormIsValid(Object.keys(e).length === 0);
  }, [name, email, password, confirmPassword]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2 ">FixMate</h1>
            <p className="text-center text-gray-600 mb-6">Join us today and start your journey!</p>
            <form className="space-y-4" onSubmit={onSubmitHandler}>
              {state === 'Sign Up' && (
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                type="text"
                onChange={e => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                value={name}
                name='fullName'
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your username" />
                {touched.name && errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              )}

              <div>
                <label className="block text-gray-700">Email</label>
                <input type="email" 
                onChange={e => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                value={email}  
                name='email'
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter your email" />
                {touched.email && errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-700">Password</label>
                <input type="password"               
                name='password'
                required
                value={password}
                onBlur={() => handleBlur('password')}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter your password" />
                <p className="text-xs text-gray-500 mt-1">Password must be 8+ chars and include uppercase, lowercase, number and special character.</p>
                {touched.password && errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-gray-700">Confrirm Password</label>
                <input type="password"               
                name='confirmPassword'
                required
                value={confirmPassword}
                onBlur={() => handleBlur('confirmPassword')}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter your password" />
                {touched.confirmPassword && errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={!formIsValid || isSubmitting} className={`w-full text-white py-2 rounded ${(!formIsValid || isSubmitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </form>
            <p className="text-center text-gray-600 mt-4">Already have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign in</a></p>
          </div>
        </div>
  )
}

export default Register
