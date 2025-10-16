
import React, { useContext, useState } from "react";
import SupplierContext from "../Context/SupplierContextDefs";
import axios from "axios";
import { toast } from "react-toastify";

const SupplierProfile = () => {

  const { supplierData, backendUrl, getSupplierAuthState } = useContext(SupplierContext);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: supplierData?.name || "",
    businessName: supplierData?.businessName || "",
    phone: supplierData?.phone || "",
    location: supplierData?.location || "",
  });
  const email = supplierData?.email || "Edit your email here";
  const rating = supplierData?.rating || 4.8;
  const verified = supplierData?.isAccountVerified ?? false;
  const displayName = supplierData?.name || "Name not set";
  const profileImageUrl = supplierData?.profileImageUrl || "";
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userType", "supplier");
    formData.append("userId", supplierData?._id || "");
    try {
      setUploading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/upload/image`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (data.success) {
        toast.success("Profile picture updated");
        await getSupplierAuthState();
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      // reset input value to allow re-select same file
      if (e.target) e.target.value = "";
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        backendUrl + "/api/supplier/update-profile",
        {
          name: form.name,
          businessName: form.businessName,
          phone: form.phone,
          location: form.location,
        },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Profile updated successfully");
        setEditMode(false);
        getSupplierAuthState();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-12 mt-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-900 flex items-center justify-center text-4xl text-white font-bold border-2 border-gray-700">
                {displayName ? displayName[0] : "S"}
              </div>
            )}
            <label
              htmlFor="supplier-avatar-input"
              className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow cursor-pointer border border-blue-400/40"
              title={uploading ? "Uploading..." : "Change profile picture"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${uploading ? 'opacity-60' : ''}`}>
                <path d="M4 3a2 2 0 00-2 2v4a1 1 0 102 0V5h10v10H5a1 1 0 100 2h9a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                <path d="M8 12a1 1 0 001 1h.379l-.293.293a1 1 0 101.414 1.414l2-2A1 1 0 0012 11H9a1 1 0 00-1 1z" />
              </svg>
              <input id="supplier-avatar-input" type="file" accept="image/*" hidden onChange={handleAvatarChange} disabled={uploading} />
            </label>
          </div>
          <div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {displayName}
              {verified ? (
                <span className="inline-flex items-center gap-1 text-green-300 text-xs font-semibold ml-2 bg-green-600/20 px-2 py-0.5 rounded-full border border-green-600/40">
                  &#10003; Verified by admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-yellow-200 text-xs font-semibold ml-2 bg-yellow-600/20 px-2 py-0.5 rounded-md border border-yellow-600/40">
                  Account not verified yet. Admin must verify the account.
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-white font-semibold">{rating}</span>
              {uploading && <span className="text-xs text-gray-300 ml-2">Uploading...</span>}
            </div>
          </div>
        </div>
        {!editMode ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        ) : null}
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSave}>
        <div>
          <label className="block text-gray-400 mb-1">Full Name</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editMode}
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Email</label>
          <input className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" value={email} disabled />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Phone</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Business Name</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Location</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            name="location"
            value={form.location}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        {editMode && (
          <div className="col-span-2 flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold"
              onClick={() => {
                setEditMode(false);
                setForm({
                  name: supplierData?.name || "",
                  businessName: supplierData?.businessName || "",
                  phone: supplierData?.phone || "",
                  location: supplierData?.location || "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SupplierProfile;
