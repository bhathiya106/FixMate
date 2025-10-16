import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { userData, isLoggedin, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setIsMobileMenuOpen(false); 
  }

  return (
    <nav className="py-3 md:py-5 flex justify-between items-center px-4 md:px-10 relative">
     
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <img src={assets.logo} alt="logo" className="w-16 md:w-24" />
      </div>

     
      <ul className="hidden md:flex list-none gap-5 text-black text-xs">
        <li onClick={() => { setMenu("home"); navigate('/'); }}
            className={`cursor-pointer pb-0.5 transition-all ${menu === "home" ? "border-b-2 border-blue-600" : "hover:border-b-2 hover:border-blue-600"}`}>
          HOME
        </li>
        <li onClick={() => { setMenu("about"); navigate('/about'); }}
            className={`cursor-pointer pb-0.5 transition-all ${menu === "about" ? "border-b-2 border-blue-600" : "hover:border-b-2 hover:border-blue-600"}`}>
          ABOUT
        </li>
        <li onClick={() => { setMenu("services"); navigate('/AllServicesPage'); }}
            className={`cursor-pointer pb-0.5 transition-all ${menu === "services" ? "border-b-2 border-blue-600" : "hover:border-b-2 hover:border-blue-600"}` }>
          SERVICES
        </li>
        <li onClick={() => { setMenu("store"); navigate('/supplystore'); }}
            className={`cursor-pointer pb-0.5 transition-all ${menu === "store" ? "border-b-2 border-blue-600" : "hover:border-b-2 hover:border-blue-600"}`}>
          STORE
        </li>
        <li onClick={() => { setMenu("contact"); navigate('/contact'); }}
            className={`cursor-pointer pb-0.5 transition-all ${menu === "contact" ? "border-b-2 border-blue-600" : "hover:border-b-2 hover:border-blue-600"}`}>
          CONTACT
        </li>
      </ul>

      
      <div className="hidden md:block">
        {isLoggedin && userData ? (
          <div className='relative group'>
            <div className='rounded-full bg-black text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-bold text-xl md:text-2xl transition-all duration-200 cursor-pointer'>
              {userData.name && userData.name[0] ? userData.name[0].toUpperCase() : "U"}
            </div>
            <div className='absolute hidden group-hover:block top-full right-0 mt-2 z-10 bg-white text-black rounded shadow-lg'>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                <li onClick={() => navigate('/userprofile')} className='px-2 py-1 hover:bg-gray-200 cursor-pointer'>Profile</li>
                {!userData.isAccountVerified && (
                  <li onClick={sendVerificationOtp} className='px-2 py-1 hover:bg-gray-200 cursor-pointer'>Verify Email</li>
                )}
                <li onClick={logout} className='px-2 py-1 hover:bg-gray-200 cursor-pointer pr-10'>Log Out</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/signup">
              <button className="bg-blue-600 text-white text-xs border border-blue-600 px-5 py-2 rounded-full cursor-pointer transition hover:bg-black hover:text-white">
                GET STARTED
              </button>
            </Link>
          </div>
        )}
      </div>

     
      <div className="md:hidden flex items-center gap-3">
       
        {isLoggedin && userData ? (
          <div className='relative group'>
            <div className='rounded-full bg-black text-white w-10 h-10 flex items-center justify-center font-bold text-lg transition-all duration-200 cursor-pointer'>
              {userData.name && userData.name[0] ? userData.name[0].toUpperCase() : "U"}
            </div>
            <div className='absolute hidden group-hover:block top-full right-0 mt-2 z-10 bg-white text-black rounded shadow-lg'>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                <li onClick={() => navigate('/userprofile')} className='px-2 py-1 hover:bg-gray-200 cursor-pointer whitespace-nowrap'>Profile</li>
                {!userData.isAccountVerified && (
                  <li onClick={sendVerificationOtp} className='px-2 py-1 hover:bg-gray-200 cursor-pointer whitespace-nowrap'>Verify Email</li>
                )}
                <li onClick={logout} className='px-2 py-1 hover:bg-gray-200 cursor-pointer whitespace-nowrap'>Log Out</li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/signup">
            <button className="bg-blue-600 text-white text-xs border border-blue-600 px-3 py-1.5 rounded-full cursor-pointer transition hover:bg-black hover:text-white">
              LOGIN
            </button>
          </Link>
        )}

        
        <button 
          className="flex flex-col justify-center items-center w-8 h-8 cursor-pointer"
          onClick={toggleMobileMenu}
        >
          <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
          <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
        </button>
      </div>

      

      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50">
          <ul className="flex flex-col list-none text-black">
            <li onClick={() => { handleMenuClick("home"); navigate('/'); }}
                className={`cursor-pointer py-4 px-6 border-b border-gray-100 transition-all ${menu === "home" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}>
              HOME
            </li>
            <li onClick={() => { handleMenuClick("about"); navigate('/about'); }}
                className={`cursor-pointer py-4 px-6 border-b border-gray-100 transition-all ${menu === "about" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}>
              ABOUT
            </li>
            <li onClick={() => { handleMenuClick("services"); navigate('/AllServicesPage'); }}
                className={`cursor-pointer py-4 px-6 border-b border-gray-100 transition-all ${menu === "services" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}>
              SERVICES
            </li>
            <li onClick={() => { handleMenuClick("store"); navigate('/supplystore'); }}
                className={`cursor-pointer py-4 px-6 border-b border-gray-100 transition-all ${menu === "store" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}>
              STORE
            </li>
            <li onClick={() => { handleMenuClick("contact"); navigate('/contact'); }}
                className={`cursor-pointer py-4 px-6 transition-all ${menu === "contact" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}>
              CONTACT
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar;