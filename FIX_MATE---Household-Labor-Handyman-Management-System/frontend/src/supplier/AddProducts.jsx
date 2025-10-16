import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import SupplierContext from "../Context/SupplierContextDefs";
import { toast } from "react-toastify";

const AddProducts = () => {
  const { backendUrl } = useContext(SupplierContext);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col items-center">
          <div className="font-semibold mb-2">Are you sure you want to add this product?</div>
          <div className="flex gap-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold"
              onClick={async () => {
                const formData = new FormData();
                formData.append("name", form.name);
                formData.append("price", form.price);
                formData.append("description", form.description);
                if (form.image) {
                  formData.append("image", form.image);
                }
                try {
                  const { data } = await axios.post(
                    backendUrl + "/api/supplier/products",
                    formData,
                    { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
                  );
                  if (data.success) {
                    toast.success("Product added successfully!");
                    setForm({ name: "", price: "", description: "", image: null });
                    setImagePreview(null);
                  } else {
                    toast.error(data.message || "Failed to add product");
                  }
                } catch (error) {
                  toast.error(error.response?.data?.message || "Failed to add product");
                }
                closeToast();
              }}
            >
              Yes, Add
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-semibold"
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8 mt-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-400 mb-1">Product Name</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Price</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Description</label>
          <textarea
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
          />

          <div className="mt-4">
            <span className="block text-gray-400 mb-1">Upload Image</span>
            <label htmlFor="image" className="cursor-pointer inline-flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 hover:border-gray-500 transition">
              {imagePreview ? (
                <img className="w-16 h-16 object-cover rounded border border-gray-600" src={imagePreview} alt="Preview" />
              ) : (
                <img className="w-10 opacity-80" src={assets.Upload_img} alt="Upload" />
              )}
              <div className="text-gray-300 text-sm">
                <div className="font-semibold">Click to choose an image</div>
                <div className="text-gray-400 text-xs">PNG, JPG up to ~5MB</div>
              </div>
              <input
                type="file"
                id="image"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
            {form.image && <div className="text-gray-400 text-xs mt-2">{form.image.name}</div>}
          </div>

        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
