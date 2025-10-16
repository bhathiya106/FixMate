import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';

const VendorsByCategory = () => {
  const { category } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${backendUrl}/api/vendor/category/${category}`);
        if (data.success) {
          setVendors(data.vendors);
        } else {
          setError(data.message || 'Failed to fetch vendors');
        }
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
        setError('Failed to fetch vendors');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [category, backendUrl]);

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-center capitalize">Available {category} Vendors</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : vendors.length === 0 ? (
          <div className="text-center text-gray-500">No availables</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {vendors.map(vendor => (
              <div
                key={vendor._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition"
              >
                <img
                  src={vendor.profileImageUrl || '/default-profile.png'}
                  alt={vendor.name}
                  className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-blue-500"
                />
                <h3 className="text-lg font-semibold mb-2">{vendor.name}</h3>
                <div className="text-sm text-gray-700 mb-4">Hourly Rate: Rs.{vendor.hourlyRate}</div>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-black transition-colors duration-200 cursor-pointer"
                  onClick={() => navigate(`/services/category/vendor/${vendor._id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VendorsByCategory;
