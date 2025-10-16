import React, { useEffect, useState, useContext } from 'react';
import Banner from '../components/Banner/Banner';
import Footer from '../components/Footer/Footer';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 12;
  const navigate = useNavigate();

  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-80 bg-white group"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl || assets.seller}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-indigo-600">Rs.{product.price}</span>
          <span className="text-xs text-gray-500">per item</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <img
            src={product.supplier?.profileImageUrl || assets.seller}
            alt={product.supplier?.businessName || 'Supplier'}
            className="w-8 h-8 rounded-full object-cover border border-indigo-400"
          />
          <div>
            <div className="text-xs font-semibold text-gray-700">{product.supplier?.businessName || product.supplier?.name || 'Supplier'}</div>
            <div className="text-xs text-gray-500">{product.supplier?.location || 'Location not set'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SupplyStore = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        // Use admin endpoint to get all products with supplier info
  const { data } = await axios.get(backendUrl + '/api/supplier/admin/all');
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Banner title="Supply Store" bgImage={assets.store} />
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Building Materials</h1>
            <p className="text-xs text-gray-600 mb-4">Quality products from trusted suppliers</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {products.length} products available
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified suppliers
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Top rated products
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500">No products available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SupplyStore;
