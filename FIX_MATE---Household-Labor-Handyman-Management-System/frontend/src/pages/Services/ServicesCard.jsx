import React, { useState, useRef } from 'react';
import Banner from '../../components/Banner/Banner';
import Footer from '../../components/Footer/Footer'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const VendorCard = ({ vendor }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    const bounds = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <div 
      ref={divRef} 
      onMouseMove={handleMouseMove} 
      onMouseEnter={() => setVisible(true)} 
      onMouseLeave={() => setVisible(false)}
      className="relative w-80 h-96 rounded-xl p-0.5 bg-white backdrop-blur-md text-gray-800 overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {visible && (
        <div 
          className="pointer-events-none blur-xl bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 size-60 absolute z-0 transition-opacity duration-300"
          style={{ top: position.y - 120, left: position.x - 120 }}
        />
      )}

      <div className="relative z-10 bg-white p-6 h-full w-full rounded-[10px] flex flex-col items-center justify-center text-center">
        <img 
          src={vendor.image} 
          alt={`${vendor.name} - ${vendor.service}`} 
          className="w-24 h-24 rounded-full shadow-md my-4 object-cover" 
        />
        <h2 className="text-md font-bold text-gray-800 mb-1">{vendor.name}</h2>
        <p className="text-xs text-indigo-500 font-medium mb-2">{vendor.service}</p>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < vendor.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2">({vendor.reviews} reviews)</span>
        </div>
        <p className="text-sm text-gray-500 mb-4 px-4 line-clamp-3">
          {vendor.description}
        </p>
        <div className="text-sm text-gray-700 mb-4">
          <p className="text-xs font-medium">Starting from <span className="text-indigo-600 font-bold">${vendor.price}</span></p>
          <p className="text-xs text-gray-500">{vendor.experience} years experience</p>
        </div>
        <div className="flex space-x-4 mb-4 text-xl text-indigo-600">
          <a href={`tel:${vendor.phone}`} className='hover:-translate-y-0.5 transition' title="Call">
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </a>
          <a href={`mailto:${vendor.email}`} className='hover:-translate-y-0.5 transition' title="Email">
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
          <a href="#" className='hover:-translate-y-0.5 transition' title="View Profile">
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </a>
        </div>
        <button className="text-xs px-4 py-2 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-black transition" onClick={() => navigate('/VendorCard')}>
          Book Now
        </button>
      </div>
    </div>
  );
};

const ServicesCard = ({ title = "Car Washing Services", bgImage = assets.carwash3 }) => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const vendors = [
    {
      id: 1,
      name: "Mike's Auto Detailing",
      service: "Car Washing Specialist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      rating: 5,
      reviews: 124,
      description: "Professional car detailing with eco-friendly products. Specializing in luxury vehicles and ceramic coating.",
      price: "25",
      experience: 8,
      phone: "+1-555-0101",
      email: "mike@autodetailing.com"
    },
    {
      id: 2,
      name: "Sarah's Shine Service",
      service: "Mobile Car Wash",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200",
      rating: 5,
      reviews: 89,
      description: "Mobile car washing service that comes to you. Interior and exterior cleaning with premium products.",
      price: "30",
      experience: 5,
      phone: "+1-555-0102",
      email: "sarah@shineservice.com"
    },
    {
      id: 3,
      name: "Elite Car Care",
      service: "Full Service Detailing",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200",
      rating: 4,
      reviews: 156,
      description: "Complete automotive detailing services including paint correction, waxing, and interior deep cleaning.",
      price: "45",
      experience: 12,
      phone: "+1-555-0103",
      email: "info@elitecarcare.com"
    },
    {
      id: 4,
      name: "Quick Wash Pro",
      service: "Express Car Washing",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200",
      rating: 4,
      reviews: 203,
      description: "Fast and efficient car washing services. Perfect for busy schedules with quality results guaranteed.",
      price: "20",
      experience: 6,
      phone: "+1-555-0104",
      email: "contact@quickwashpro.com"
    },
    {
      id: 5,
      name: "Premium Auto Spa",
      service: "Luxury Car Detailing",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      rating: 5,
      reviews: 78,
      description: "High-end detailing service for luxury and exotic vehicles. Hand washing and premium protection packages.",
      price: "75",
      experience: 15,
      phone: "+1-555-0105",
      email: "luxury@autospa.com"
    },
    {
      id: 6,
      name: "Green Clean Auto",
      service: "Eco-Friendly Car Wash",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200",
      rating: 4,
      reviews: 167,
      description: "Environmentally conscious car washing using biodegradable products and water-saving techniques.",
      price: "28",
      experience: 7,
      phone: "+1-555-0106",
      email: "eco@greenclean.com"
    }
  ];

  return (
    <div>
      <Banner title={title} bgImage={bgImage} />
      
      <div className="min-h-screen bg-gray-50">
       
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Service Provider</h1>
              <p className="text-xs text-gray-600 mb-4">Professional and verified service experts in your area</p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {vendors.length} vendors available
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified professionals
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Top rated service
                </span>
              </div>
            </div>
          </div>
        </div>

       <div className="flex items-center border pl-4 gap-2 border-gray-500/30 h-[40px] rounded-full overflow-hidden w-80 ml-auto mt-6 bg-white shadow-sm">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="#6B7280">
    <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
  </svg>
  <input
    type="text"
    placeholder="Search"
    className="w-full h-full outline-none text-gray-500 bg-transparent placeholder-gray-500 text-sm"
  />
</div>

        
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServicesCard;