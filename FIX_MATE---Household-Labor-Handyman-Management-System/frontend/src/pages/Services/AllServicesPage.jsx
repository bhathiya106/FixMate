import React from 'react'
import Banner from '../../components/Banner/Banner'
import { assets } from '../../assets/assets';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const threshold = 12;

  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div 
      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-80 bg-white group"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {service.name}
        </h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-indigo-600">Rs.{service.price}</span>
            <span className="text-sm text-gray-500">starting</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < service.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({service.reviews})</span>
          </div>
        </div>
        
        <button 
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-black transition-colors transform hover:scale-105 duration-200 cursor-pointer"
          onClick={() => navigate(`/services/category/${service.category}`)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

const AllServicesPage = () => {
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const services = [
    {
      id: 1,
      name: "Plumber",
      description: "Expert plumbing services for repairs, installations, and maintenance of pipes, fixtures, and water systems.",
      image: assets.service4,
      price: 49,
      rating: 4,
      reviews: 203,
      category: "Plumber"
    },
    {
      id: 2,
      name: "Electrician",
      description: "Licensed electricians for wiring, outlet installation, troubleshooting, and electrical repairs.",
      image: assets.service5,
      price: 29,
      rating: 5,
      reviews: 78,
      category: "Electrician"
    },
    {
      id: 3,
      name: "Carpenter",
      description: "Professional carpentry services for furniture, doors, windows, and custom woodwork projects.",
      image: assets.service11,
      price: 35,
      rating: 5,
      reviews: 120,
      category: "Carpenter"
    },
    {
      id: 4,
      name: "Painter",
      description: "Interior and exterior painting, wall repairs, and complete home or office painting solutions.",
      image: assets.service3,
      price: 29,
      rating: 5,
      reviews: 156,
      category: "Painter"
    },
    {
      id: 5,
      name: "Mechanic",
      description: "Automotive mechanic services for car repairs, maintenance, and diagnostics.",
      image: assets.service12,
      price: 40,
      rating: 4,
      reviews: 110,
      category: "Mechanic"
    },
    {
      id: 6,
      name: "Gardener",
      description: "Gardening and landscaping services for lawn care, plant maintenance, and outdoor beautification.",
      image: assets.service14,
      price: 39,
      rating: 4,
      reviews: 167,
      category: "Gardener"
    },
    {
      id: 7,
      name: "Cleaner",
      description: "Complete home and office cleaning services including deep cleaning and regular maintenance.",
      image: assets.service8,
      price: 29,
      rating: 4,
      reviews: 92,
      category: "Cleaner"
    },
    {
      id: 8,
      name: "Security",
      description: "Professional security services including installation, monitoring, and maintenance solutions.",
      image: assets.service10,
      price: 49,
      rating: 4,
      reviews: 92,
      category: "Security"
    },
    {
      id: 9,
      name: "Pest Control Specialist",
      description: "Pest control and extermination services for homes and businesses, using safe and effective methods.",
      image: assets.service13,
      price: 35,
      rating: 4,
      reviews: 60,
      category: "PestControl"
    },
    {
      id: 10,
      name: "Mason",
      description: "Masonry services for brickwork, stonework, tiling, and construction projects.",
      image: assets.service15,
      price: 45,
      rating: 5,
      reviews: 80,
      category: "Mason"
    }

  ];

  const handleServiceNavigate = (service) => {
   
    console.log('Navigate to service:', service.name);
   
  };

  return (
    <div>
      <Banner title="All Services" bgImage={assets.banner1} />
      
     
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Services</h1>
            <p className="text-xs text-gray-600 mb-4">Professional and verified service providers in your area</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {services.length} services available
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
                Top rated services
              </span>
            </div>
          </div>
        </div>
      </div>

     
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onNavigate={handleServiceNavigate}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default AllServicesPage;