import React from 'react'
import { assets } from '../../assets/assets'

const Steps = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 py-8'>
      <div className='text-left mb-8 md:mb-12'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>
          How It Works
        </h1>
        <p className='text-xs text-gray-600 max-w-2xl'>
          Follow these simple steps to get started with our services.
        </p>
      </div>
      <div className='flex flex-wrap justify-center gap-2' style={{backgroundImage: `url(${assets.step_bg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="step-card mt-10 mb-10 bg-white/80 p-4 border border-gray-200 rounded-xl shadow-md" style={{width: '304px', height: '180px'}}>
          <h2 className='text-center text-xs font-semibold text-blue-600 mb-2'>Step 1</h2>
          <h2 className='text-center text-lg font-semibold text-gray-800 mb-2'>Choose a Service</h2>
          <p className='text-center text-xs text-gray-600'>
            Choose the service you need and book an appointment.
          </p>
        </div>
        <div className='step-card mt-10 mb-10 bg-white/80 p-4 border border-gray-200 rounded-xl shadow-md' style={{width: '304px', height: '180px'}}>
          <h2 className='text-center text-xs font-semibold text-blue-600 mb-2'>Step 2</h2>
          <h2 className='text-center text-lg font-semibold text-gray-800 mb-2'>Schedule a Visit</h2>
          <p className='text-center text-xs text-gray-600'>
            Our professionals will arrive at your location on time.
          </p>
        </div>
        <div className='step-card mt-10 mb-10 bg-white/80 p-4 border border-gray-200 rounded-xl shadow-md' style={{width: '304px', height: '180px'}}>
          <h2 className='text-center text-xs font-semibold text-blue-600 mb-2'>Step 3</h2>
          <h2 className='text-center text-lg font-semibold text-gray-800 mb-2'>Get It Done</h2>
          <p className='text-center text-xs text-gray-600'>
            Enjoy your clean and well-maintained space!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Steps