import React from 'react';
import Footer from '../../components/Footer/Footer';

const VendorCard = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const vendor = {
    name: "Mike's Auto Detailing",
    category: "Car Washing & Detailing",
    experience: "8 years experience",
    hourlyRate: 25,
    offerRate: 20,
    rating: 5,
    totalReviews: 124,
    location: "Downtown Area",
    phone: "+1-555-0101",
    email: "mike@autodetailing.com",
    images: [
      "https://plus.unsplash.com/premium_photo-1661594613495-d390917b5431?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1171&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1694678505383-676d78ea3b96?q=80&w=1170&auto=format&fit=crop",
      "https://plus.unsplash.com/premium_photo-1663036890611-bdc3a9ee070f?q=80&w=1170&auto=format&fit=crop"
    ],
    services: [
      "Exterior car washing and waxing",
      "Interior deep cleaning and vacuuming",
      "Engine bay cleaning and detailing",
      "Ceramic coating application",
      "Paint correction and polishing",
      "Mobile service available"
    ],
    description: "Professional car detailing specialist with over 8 years of experience...",
    availability: "Monday - Saturday: 8:00 AM - 6:00 PM",
    serviceArea: "5 mile radius from downtown"
  };

  const [thumbnail, setThumbnail] = React.useState(vendor.images[0]);

  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            
            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto sm:mx-0">
                  <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/> </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{vendor.name}</h1>
                  <p className="text-base sm:text-lg opacity-90">{vendor.category}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      {Array(5).fill('').map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${vendor.rating > i ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                      <span className="ml-1 text-sm sm:text-lg">({vendor.totalReviews})</span>
                    </div>
                    <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {vendor.experience}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                
                
                <div className="lg:w-1/2">
                  <div className="flex flex-col sm:flex-row gap-4">
                   
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                      {vendor.images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => setThumbnail(image)}
                          className={`min-w-[4.5rem] sm:w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                            thumbnail === image ? 'border-indigo-500' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <img src={image} alt={`Service ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>

                   
                    <div className="flex-1 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img src={thumbnail} alt="Selected service" className="w-full h-64 sm:h-96 object-cover" />
                    </div>
                  </div>
                </div>

              
                <div className="lg:w-1/2 space-y-6 text-sm sm:text-base">
                 
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Service Pricing</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-gray-500 line-through">Rs.{vendor.hourlyRate}/hr</span>
                      <span className="text-2xl sm:text-3xl font-bold text-indigo-600">Rs.{vendor.offerRate}/hr</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm">
                        Save Rs.{vendor.hourlyRate - vendor.offerRate}
                      </span>
                    </div>
                  </div>

                 
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Contact</h3>
                    <div className="space-y-2">
                      <p>{vendor.phone}</p>
                      <p>{vendor.email}</p>
                      <p>{vendor.location}</p>
                    </div>
                  </div>

                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Services</h3>
                    <ul className="space-y-1">
                      {vendor.services.map((s, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-green-500">✔</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                 
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Availability</h3>
                    <p>{vendor.availability}</p>
                    <p className="text-sm text-gray-600">Area: {vendor.serviceArea}</p>
                  </div>

                 
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button className="w-full sm:flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-black cursor-pointer">
                      Book Now
                    </button>
                    <button className="w-full sm:flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 cursor-pointer">
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorCard;
