import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Delivery = () => {
  const navigate = useNavigate();

  const handleJoinAsDriver = () => {
    navigate('/deliveryregister');
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      <div className="md:grid md:grid-cols-2 max-w-4xl bg-white mx-auto rounded-xl shadow-lg overflow-hidden h-auto md:h-64">
        <img 
          src={assets.driver} 
          className="hidden md:block w-full h-64 object-cover" 
          alt="Delivery driver"
        />
        <div className="flex items-center justify-center py-6 px-6 md:px-8">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-bold">
              Join Our Team as a <span className="text-blue-600">Delivery Driver</span>
            </h2>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              At FixMate, being a driver means more than just deliveries — you become part of a trusted community that values reliability, care, and teamwork
            </p>
            <button 
              onClick={handleJoinAsDriver}
              className="rounded-lg bg-blue-600 text-xs px-8 py-2 mt-3 text-white hover:bg-black transition-colors duration-200 font-medium cursor-pointer"
            >
              Join as a Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery