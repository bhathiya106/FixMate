import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
    
      <div className='text-left mb-8 md:mb-12'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2'>
         Popular Services
        </h1>
        <p className='text-xs  text-gray-600  max-w-2xl'>
          From cleaning to repairs, Fixmate makes booking trusted pros simple and hassle-free.
        </p>
      </div>

      
      <div className='block sm:hidden overflow-x-auto pb-4'>
        <div className='flex gap-4 w-max'>
          <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 w-72' style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
            <div className='relative'>
              <img 
                className='w-full h-48 object-cover' 
                src={assets.service4} 
                alt="Plumbing Repairs" 
              />
            </div>
            <div className='p-4'>
              <h2 className='text-base font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition'>
                Plumbing Repairs
              </h2>
              <p className='text-xs  text-gray-600  max-w-2xl'>
                Professional plumbing repair services to fix leaks, clogs, pipe installations, and emergency repairs. Our certified plumbers use modern tools and techniques.
              </p>
              <p className='text-xs text-gray-500 mb-2'>by John Rodriguez</p>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <span className='text-yellow-400'>★★★★★</span>
                  <span className='text-xs text-gray-500 ml-1'>(4.9)</span>
                </div>
              </div>
              <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl' onClick={() => navigate('/services/category/Plumber')}>
                Hire Now
              </button>
            </div>
          </div>

          <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 w-72' style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
            <div className='relative'>
              <img 
                className='w-full h-48 object-cover' 
                src={assets.service5} 
                alt="Electrical Services" 
              />
            </div>
            <div className='p-4'>
              <h2 className='text-base font-semibold text-gray-800 mb-2'>
                Electrical Services
              </h2>
              <p className='text-xs text-gray-600 leading-relaxed mb-3'>
                Comprehensive electrical services for your home, including repairs, installations, wiring upgrades, and safety inspections with licensed electricians.
              </p>
              <p className='text-xs text-gray-500 mb-2'>by Mike Thompson</p>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <span className='text-yellow-400'>★★★★☆</span>
                  <span className='text-xs text-gray-500 ml-1'>(4.7)</span>
                </div>
              </div>
              <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl'>
                Hire Now
              </button>
            </div>
          </div>

          <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 w-72' style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
            <div className='relative'>
              <img 
                className='w-full h-48 object-cover' 
                src={assets.service6} 
                alt="Furniture Assembly" 
              />
            </div>
            <div className='p-4'>
              <h2 className='text-base font-semibold text-gray-800 mb-2'>
                Furniture Assembly
              </h2>
              <p className='text-xs text-gray-600 leading-relaxed mb-3'>
                Expert furniture assembly services to help you set up your new furniture quickly and efficiently. We handle all types of furniture with precision.
              </p>
              <p className='text-xs text-gray-500 mb-2'>by Sarah Davis</p>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <span className='text-yellow-400'>★★★★★</span>
                  <span className='text-xs text-gray-500 ml-1'>(4.8)</span>
                </div>
              </div>
              <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl'>
                Hire Now
              </button>
            </div>
          </div>

          <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 w-72' style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
            <div className='relative'>
              <img 
                className='w-full h-48 object-cover' 
                src={assets.service10} 
                alt="Security Services" 
              />
            </div>
            <div className='p-4'>
              <h2 className='text-base font-semibold text-gray-800 mb-2'>
                Security
              </h2>
              <p className='text-xs text-gray-600 leading-relaxed mb-3'>
                Professional security services to protect your home or business. We offer surveillance system installation, alarm monitoring, and on-site security personnel to ensure your safety and peace of mind.
              </p>
              <p className='text-xs text-gray-500 mb-2'>by Robert Chen</p>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <span className='text-yellow-400'>★★★★★</span>
                  <span className='text-xs text-gray-500 ml-1'>(4.9)</span>
                </div>
              </div>
              <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl'>
                Hire Now
              </button>
            </div>
          </div>

          <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 w-72' style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
            <div className='relative'>
              <img 
                className='w-full h-48 object-cover' 
                src={assets.service8} 
                alt="Mattress and Curtain Cleaning" 
              />
            </div>
            <div className='p-4'>
              <h2 className='text-base font-semibold text-gray-800 mb-2'>
                Mattress and Curtain Cleaning
              </h2>
              <p className='text-xs text-gray-600 leading-relaxed mb-3'>
                Expert mattress and curtain cleaning services to refresh your home and improve air quality. We use eco-friendly cleaning solutions and advanced techniques. 
              </p>
              <p className='text-xs text-gray-500 mb-2'>by Lisa Martinez</p>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <span className='text-yellow-400'>★★★★☆</span>
                  <span className='text-xs text-gray-500 ml-1'>(4.6)</span>
                </div>
              </div>
              <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl'>
                Hire Now
              </button>
            </div>
          </div>

          <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 w-72' style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
            <div className='relative'>
              <img 
                className='w-full h-48 object-cover' 
                src={assets.service9} 
                alt="Hair Styling Experts" 
              />
            </div>
            <div className='p-4'>
              <h2 className='text-base font-semibold text-gray-800 mb-2'>
                Hair Styling Experts
              </h2>
              <p className='text-xs text-gray-600 leading-relaxed mb-3'>
                Expert hair styling services to give you the perfect look for any occasion. From cuts and colors to special event styling with premium products.
              </p>
              <p className='text-xs text-gray-500 mb-2'>by Emma Wilson</p>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <span className='text-yellow-400'>★★★★★</span>
                  <span className='text-xs text-gray-500 ml-1'>(4.9)</span>
                </div>
              </div>
              <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl'>
                Hire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className='hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
        <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden' style={{borderTopLeftRadius: '40px', borderTopRightRadius: '40px'}}>
          <div className='relative'>
            <img 
              className='w-full h-48 md:h-56 object-cover' 
              src={assets.service4} 
              alt="Plumbing Repairs" 
            />
          </div>
          <div className='p-4'>
            <h2 className='text-base md:text-lg font-semibold text-gray-800 mb-2'>
              Plumbing Repairs
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Professional plumbing repair services to fix leaks, clogs, pipe installations, and emergency repairs. Our certified plumbers use modern tools and techniques to solve any plumbing issue quickly and efficiently.
            </p>
            <p className='text-xs text-gray-500 mb-2'>by John Rodriguez</p>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★★</span>
                <span className='text-xs text-gray-500 ml-1'>(4.9)</span>
              </div>
            </div>
            <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl' onClick={() => navigate('/services/category/Plumber')}>
              Hire Now
            </button>
          </div>
        </div>

        <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden' style={{borderTopLeftRadius: '40px', borderTopRightRadius: '40px'}}>
          <div className='relative'>
            <img 
              className='w-full h-48 md:h-56 object-cover' 
              src={assets.service5} 
              alt="Electrical Services" 
            />
          </div>
          <div className='p-4'>
            <h2 className='text-base md:text-lg font-semibold text-gray-800 mb-2'>
              Electrical Services
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Comprehensive electrical services for your home, including repairs, installations, wiring upgrades, and safety inspections. Our licensed electricians ensure all work meets safety standards and local codes with  workmanship.
            </p>
            <p className='text-xs text-gray-500 mb-2'>by Mike Thompson</p>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★☆</span>
                <span className='text-xs text-gray-500 ml-1'>(4.7)</span>
              </div>
            </div>
            <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl' onClick={() => navigate('/services/category/Electrician')}>
              Hire Now
            </button>
          </div>
        </div>

        <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden' style={{borderTopLeftRadius: '40px', borderTopRightRadius: '40px'}}>
          <div className='relative'>
            <img 
              className='w-full h-48 md:h-56 object-cover' 
              src={assets.service6} 
              alt="Furniture Assembly" 
            />
          </div>
          <div className='p-4'>
            <h2 className='text-base md:text-lg font-semibold text-gray-800 mb-2'>
              Furniture Assembly
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Expert furniture assembly services to help you set up your new furniture quickly and efficiently. We handle all types of furniture from IKEA to custom pieces, ensuring everything is assembled correctly and safely.
            </p>
            <p className='text-xs text-gray-500 mb-2'>by Sarah Davis</p>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★★</span>
                <span className='text-xs text-gray-500 ml-1'>(4.8)</span>
              </div>
            </div>
            <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl' onClick={() => navigate('/services/category/Carpenter')}>
              Hire Now
            </button>
          </div>
        </div>

        <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden' style={{borderTopLeftRadius: '40px', borderTopRightRadius: '40px'}}>
          <div className='relative'>
            <img 
              className='w-full h-48 md:h-56 object-cover' 
              src={assets.service10} 
              alt="Security Services" 
            />
          </div>
          <div className='p-4'>
            <h2 className='text-base md:text-lg font-semibold text-gray-800 mb-2'>
              Security
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Professional security services to protect your home or business. We offer surveillance system installation, alarm monitoring, and on-site security personnel to ensure your safety and peace of mind.
            </p>
            <p className='text-xs text-gray-500 mb-2'>by Robert Chen</p>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★★</span>
                <span className='text-xs text-gray-500 ml-1'>(4.9)</span>
              </div>
            </div>
            <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl' onClick={() => navigate('/services/category/Security')}>
              Hire Now
            </button>
          </div>
        </div>

        <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden' style={{borderTopLeftRadius: '40px', borderTopRightRadius: '40px'}}>
          <div className='relative'>
            <img 
              className='w-full h-48 md:h-56 object-cover' 
              src={assets.service8} 
              alt="Mattress and Curtain Cleaning" 
            />
          </div>
          <div className='p-4'>
            <h2 className='text-base md:text-lg font-semibold text-gray-800 mb-2'>
              Mattress and Curtain Cleaning
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
            Expert mattress and curtain cleaning services to refresh your home and improve air quality. We use eco-friendly cleaning solutions and advanced equipment to remove dust, allergens, and stains effectively.
            </p>
            <p className='text-xs text-gray-500 mb-2'>by Lisa Martinez</p>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★☆</span>
                <span className='text-xs text-gray-500 ml-1'>(4.6)</span>
              </div>
            </div>
            <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl' onClick={() => navigate('/services/category/Cleaner')}>
              Hire Now
            </button>
          </div>
        </div>

        <div className='service-card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden' style={{borderTopLeftRadius: '40px', borderTopRightRadius: '40px'}}>
          <div className='relative'>
            <img 
              className='w-full h-48 md:h-56 object-cover' 
              src={assets.service14} 
              alt="Gardener" 
            />
          </div>
          <div className='p-4'>
            <h2 className='text-base md:text-lg font-semibold text-gray-800 mb-2'>
              Gardener
            </h2>
            <p className='text-xs text-gray-600 leading-relaxed mb-3'>
              Professional gardening services to enhance your outdoor space. Our team offers landscaping, lawn care, and garden maintenance to keep your property looking its best.
            </p>
            <p className='text-xs text-gray-500 mb-2'>by Emma Wilson</p>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center'>
                <span className='text-yellow-400'>★★★★★</span>
                <span className='text-xs text-gray-500 ml-1'>(4.9)</span>
              </div>
            </div>
            <button className='w-full bg-blue-600 text-white py-2 px-4 text-xs font-medium hover:bg-black cursor-pointer transition-colors duration-200 rounded-xl' onClick={() => navigate('/services/category/Gardener')}>
              Hire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services