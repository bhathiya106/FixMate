import React, { useContext, useState, useEffect } from "react";
import { DeliveryContext } from "../Context/DeliveryContext";

const Profile = () => {
  const { deliveryData, updateDeliveryProfile } = useContext(DeliveryContext) || {};
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    operatingArea: '',
    phone: '',
    location: '',
    bio: '',
    isAvailable: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (deliveryData) {
      setFormData({
        name: deliveryData.name || '',
        rate: deliveryData.rate || '',
        operatingArea: deliveryData.operatingArea || '',
        phone: deliveryData.phone || '',
        location: deliveryData.location || '',
        bio: deliveryData.bio || '',
        isAvailable: deliveryData.isAvailable ?? true
      });
    }
  }, [deliveryData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    // Reset file input
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData to handle file upload if image is selected
    const submitData = { ...formData };
    if (profileImage) {
      // For now, we'll convert to base64 - in production, you'd upload to a file service
      const reader = new FileReader();
      reader.onload = async () => {
        submitData.profileImageUrl = reader.result;
        const success = await updateDeliveryProfile(submitData);
        if (success) {
          setIsEditing(false);
          setProfileImage(null);
          setPreviewImage(null);
        }
        setLoading(false);
      };
      reader.readAsDataURL(profileImage);
    } else {
      const success = await updateDeliveryProfile(submitData);
      if (success) {
        setIsEditing(false);
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    if (deliveryData) {
      setFormData({
        name: deliveryData.name || '',
        rate: deliveryData.rate || '',
        operatingArea: deliveryData.operatingArea || '',
        phone: deliveryData.phone || '',
        location: deliveryData.location || '',
        bio: deliveryData.bio || '',
        isAvailable: deliveryData.isAvailable ?? true
      });
    }
    setIsEditing(false);
    setProfileImage(null);
    setPreviewImage(null);
    // Reset file input
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Delivery Driver Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative mb-4">
                {previewImage || deliveryData?.profileImageUrl ? (
                  <img
                    src={previewImage || deliveryData?.profileImageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-green-600"
                  />
                ) : (
                  <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    {deliveryData?.name?.[0]?.toUpperCase() || 'D'}
                  </div>
                )}
                
                {isEditing && (
                  <div className="mt-3 space-y-2">
                    <label htmlFor="profileImageInput" className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition inline-block">
                      {previewImage || deliveryData?.profileImageUrl ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <input
                      id="profileImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {(previewImage || deliveryData?.profileImageUrl) && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="block mx-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="text-xs text-gray-400">Max 5MB, JPG/PNG only</p>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{deliveryData?.name || 'Driver Name'}</h3>
              <p className="text-gray-400 mb-4">{deliveryData?.email || 'Email not set'}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-semibold ${deliveryData?.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {deliveryData?.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deliveries:</span>
                  <span className="text-blue-400 font-semibold">{deliveryData?.totalDeliveries || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rate:</span>
                  <span className="text-green-400 font-semibold">${deliveryData?.rate || 0}/delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Rate (USD)
                  </label>
                  <input
                    type="number"
                    name="rate"
                    min="0"
                    value={formData.rate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Operating Area
                  </label>
                  <input
                    type="text"
                    name="operatingArea"
                    value={formData.operatingArea}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    placeholder="e.g., Colombo, Island Wide"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Location (Optional)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    placeholder="Your current location"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 disabled:opacity-50"
                    placeholder="Tell customers about yourself and your delivery service..."
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 disabled:opacity-50"
                    />
                    <label className="ml-2 text-sm text-gray-300">
                      Available for deliveries
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Uncheck this if you want to temporarily stop receiving delivery requests
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={deliveryData?.email || ''}
              disabled
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white opacity-50"
            />
            <p className="text-xs text-gray-400 mt-1">Contact support to change your email address</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
            <input
              type="text"
              value={deliveryData?.createdAt ? new Date(deliveryData.createdAt).toLocaleDateString() : 'Unknown'}
              disabled
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;