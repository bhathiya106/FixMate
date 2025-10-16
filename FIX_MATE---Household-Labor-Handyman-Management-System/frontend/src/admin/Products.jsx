import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/supplier/admin/all');
      if (data.success) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error(err.response.data.message || 'Session expired. Please log in again.');
        navigate('/adminlogin');
      } else {
        setProducts([]);
        toast.error('Failed to fetch products.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
  }, []);

  const handleRemove = (productId) => {
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to remove this product?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(`/api/supplier/admin/${productId}`);
                toast.success('Product removed.');
                fetchProducts();
              } catch {
                toast.error('Failed to remove product.');
              }
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false, position: 'top-center' }
    );
  };

  // Group products by supplier
  const productsBySupplier = products.reduce((acc, product) => {
    const supplierName = product.supplier?.name || 'Unknown Supplier';
    if (!acc[supplierName]) acc[supplierName] = [];
    acc[supplierName].push(product);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Products Management</h2>
        <button onClick={fetchProducts} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Refresh</button>
      </div>
      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400">No products found.</div>
      ) : (
        <div className="space-y-10">
          {Object.entries(productsBySupplier).map(([supplier, prods]) => (
            <div key={supplier} className="border border-gray-800 rounded-lg p-4 bg-gray-900">
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Supplier: <span className="px-2 py-1 rounded-full text-xs font-medium border bg-indigo-900/30 text-indigo-300 border-indigo-700">{supplier}</span></h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-lg mb-6">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-white">Product Name</th>
                      <th className="px-4 py-3 text-left text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prods.map(product => (
                      <tr key={product._id} className="border-b border-gray-800">
                        <td className="px-4 py-3 text-gray-200">{product.name}</td>
                        <td className="px-4 py-3">
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                            onClick={() => handleRemove(product._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
