import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';

const Seller = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div
        className="flex flex-col items-start justify-center text-left p-6 sm:p-10 md:p-16 bg-white/80 rounded-xl shadow-lg w-full max-w-3xl"
        style={{
          backgroundImage: `url(${assets.seller})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
       
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
          Grow Your Service Business with FixMate Today
        </h2>

       
        <p className="text-sm sm:text-base text-gray-600 mt-3">
          Join our network of skilled professionals <br className="hidden sm:block" />
          and get more clients with ease.
        </p>

       
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-6 w-full">
          <button className="w-full sm:w-auto text-sm px-5 py-2.5 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-black transition" onClick={() => navigate('/SupplierRegister')}>
            Join as a Seller
          </button>
          <button 
            type="button"
            className="w-full sm:w-auto text-sm px-5 py-2.5 bg-white text-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 transition" onClick={() => navigate('/vendorregister')}>
          
            Join as a Worker
           
          </button>
        </div>
      </div>
    </div>
  )
}

export default Seller
