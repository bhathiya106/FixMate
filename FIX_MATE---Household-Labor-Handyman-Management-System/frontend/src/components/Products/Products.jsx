import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
     
      <div className='text-left mb-8 md:mb-12'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>
          Featured Services
        </h1>
        <p className='text-xs  text-gray-600  max-w-2xl'>
          From everyday repairs to specialized tasks, these are the services our customers rely on most.
        </p>
      </div>

     
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
        
       
        <div className='service-card overflow-hidden'>
          <div className='relative'>
            <img 
              className='border-none rounded-4xl h-48 md:h-40 object-cover cursor-pointer hover:scale-101 transition-transform duration-300' onClick={() => navigate('/Services/category/Carpenter')}
              src={assets.service11}
              alt="Car Washing Service"
            />
          </div>
          <div className='p-4'>
            <h2 className='text-xm md:text-base font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition '  onClick={() => navigate('/Services/category/Carpenter')}>
              Carpenter
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Professional carpentry services to bring your woodworking projects to life.
            </p>
            <div className='flex items-center justify-between'>
              <span className='text-base font-bold text-blue-600'>Rs.2500</span>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★★</span>
                <span className='text-xs text-gray-500 ml-1'>(4.8)</span>
              </div>
            </div>
          </div>
        </div>

       
        <div className='service-card overflow-hidden'>
          <div className='relative'>
            <img 
              className='border-none rounded-4xl  h-48 md:h-40 object-cover cursor-pointer hover:scale-101 transition-transform duration-300' onClick={() => navigate('/services/category/Cleaner')}
              src={assets.service2}
              alt="House Cleaning Service"
            />
          </div>
          <div className='p-4'>
            <h2 className='text-sm md:text-base font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition' onClick={() => navigate('/services/category/Cleaner')}>
              House Cleaning
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Comprehensive home cleaning services for a spotless and healthy living space.
            </p>
            <div className='flex items-center justify-between'>
              <span className='text-base font-bold text-blue-600'>Rs.1500</span>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★☆</span>
                <span className='text-xs text-gray-500 ml-1'>(4.6)</span>
              </div>
            </div>
          </div>
        </div>

       
        <div className='service-card overflow-hidden'>
          <div className='relative'>
            <img 
              className='border-none rounded-4xl  h-48 md:h-40 object-cover cursor-pointer hover:scale-101 transition-transform duration-300' onClick={() => navigate('/services/category/Painter')}
              src={assets.service3}
              alt="Painting and Renovation Service"
            />
          </div>
          <div className='p-4'>
            <h2 className='text-sm md:text-base font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition' onClick={() => navigate('/services/category/Painter')}>
              Painting & Renovation
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Expert painting and renovation services to transform your space beautifully.
            </p>
            <div className='flex items-center justify-between'>
              <span className='text-base font-bold text-blue-600'>Rs.2000</span>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★★</span>
                <span className='text-xs text-gray-500 ml-1'>(4.9)</span>
              </div>
            </div>
          </div>
        </div>

        
        
      </div>
      <div className='flex justify-center'>
        <button className='text-xs px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-black transition'  onClick={() => navigate('/AllServicesPage')}>
          View All Services
        </button>
      </div>
      </div>
  )
}

export default Products