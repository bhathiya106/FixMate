import { AppContext } from '../Context/AppContext';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'

const SignUp = () => {

  
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        // Store the token first
        localStorage.setItem('token', data.token);
        // Then update the login state
        setIsLoggedin(true);
        // Get user data with the new token
        await getUserData();
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white px-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2 ">FixMate</h1>
        <p className="text-center text-gray-600 mb-6">Welcome back! Sign in to your account</p>
        
        <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
          <div className="flex flex-col gap-1">

            <label className="block text-gray-700">Email Address</label>
            <input type='email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter your email" required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-gray-700">Password</label>
            <input type='password'
            name='password'
            value={password}
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter your password" required />
          </div>

          <div className="flex items-center justify-between text-sm mt-1 mb-2">
            
            <a href="#" onClick={()=>navigate('/reset-password')} className="text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2">Sign In</button>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm">Don't have an account? <a onClick={()=>navigate('/register')} className="text-blue-600 hover:underline">Sign up here</a></p>
        
      </div>
    </div>
  )
}

export default SignUp
