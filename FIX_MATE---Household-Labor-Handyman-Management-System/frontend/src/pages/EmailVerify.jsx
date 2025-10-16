import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp });

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white px-2">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">FixMate</h1>
        <p className="text-center text-gray-600 mb-6">Enter the 6-digit code sent to your email</p>

        <form className="flex flex-col gap-4" onSubmit={onSubmitHandler} onPaste={handlePaste}>
          <div className="flex justify-between gap-2 mb-4">
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 text-center text-lg"
                ref={e => inputRefs.current[index] = e}
                onInput={e => handleInput(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Verify Email
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default EmailVerify;
