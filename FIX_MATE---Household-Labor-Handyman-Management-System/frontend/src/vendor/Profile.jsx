import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { VendorContext } from "../Context/VendorContext";
import { toast } from "react-toastify";


const MAX_GALLERY_IMAGES = 4;

const Profile = () => {
  const { backendUrl } = useContext(VendorContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    hourlyRate: "",
    profileImageUrl: "",
    category: "",
    description: "",
    isAccountVerified: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryImagesFromDb, setGalleryImagesFromDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/vendor/data", { withCredentials: true });
        if (data.success && data.vendor) {
          setForm({
            name: data.vendor.name || "",
            email: data.vendor.email || "",
            phone: data.vendor.phone || "",
            address: data.vendor.address || "",
            hourlyRate: data.vendor.hourlyRate || "",
            profileImageUrl: data.vendor.profileImageUrl || "",
            category: data.vendor.category || "",
            description: data.vendor.description || "",
            isAccountVerified: !!data.vendor.isAccountVerified
          });
          setProfileImagePreview(data.vendor.profileImageUrl || null);
          setGalleryImagesFromDb(data.vendor.galleryImages || []);
        } else {
          toast.error(data.message || "Failed to fetch profile");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [backendUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_GALLERY_IMAGES);
    const previews = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setGalleryImages(previews);
    setGalleryImagesFromDb([]); // Clear DB images if uploading new ones
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("hourlyRate", form.hourlyRate);
      formData.append("description", form.description);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      galleryImages.forEach((imgObj, idx) => {
        formData.append(`galleryImage${idx+1}`, imgObj.file);
      });
      const { data } = await axios.put(
        backendUrl + "/api/vendor/profile",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (data.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        if (data.vendor && data.vendor.profileImageUrl) {
          setProfileImagePreview(data.vendor.profileImageUrl);
        }
        setGalleryImages([]);
        setGalleryImagesFromDb(data.vendor.galleryImages || []);
        setForm(f => ({ ...f, description: data.vendor.description || "" }));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="text-gray-300">Loading...</div>;

  return (
  <div className="w-full max-w-screen-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8 mt-6">
      <h2 className="text-2xl font-bold text-white mb-2">Vendor Profile</h2>
      {/* Verification badge / hint */}
      <div className="mb-6">
        {form.isAccountVerified ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/20 text-green-300 border border-green-600/40 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-2.89a.75.75 0 10-1.22-.88l-3.72 5.15-1.69-1.69a.75.75 0 10-1.06 1.06l2.25 2.25c.33.33.87.29 1.15-.09l4.29-5.79z" clipRule="evenodd"/></svg>
            Account verified by admin
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-600/20 text-yellow-200 border border-yellow-600/40 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Account not verified yet. Admin must verify the account.
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-2 border-4 border-blue-500">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-4xl text-gray-400">?</span>
            )}
          </div>
          {editing && (
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer text-xs">
              Change Photo
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>
          )}
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-gray-400">Hourly Rate: </span>
            {editing ? (
              <input
                className="w-32 p-1 rounded bg-gray-700 text-white border border-gray-600"
                name="hourlyRate"
                type="number"
                min="0"
                value={form.hourlyRate}
                onChange={handleChange}
                required
              />
            ) : (
              <span className="text-white font-bold">Rs.{form.hourlyRate}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {galleryImages.length > 0
              ? galleryImages.map((imgObj, idx) => (
                  <img key={idx} src={imgObj.preview} alt="Gallery" className="w-24 h-16 object-cover rounded-lg border-2 border-gray-700" />
                ))
              : galleryImagesFromDb.length > 0
                ? galleryImagesFromDb.slice(0, MAX_GALLERY_IMAGES).map((url, idx) => (
                    <img key={idx} src={url} alt="Gallery" className="w-24 h-16 object-cover rounded-lg border-2 border-gray-700" />
                  ))
                : [...Array(MAX_GALLERY_IMAGES)].map((_, idx) => (
                    <div key={idx} className="w-24 h-16 bg-gray-700 rounded-lg border-2 border-gray-700 flex items-center justify-center text-gray-500">No Image</div>
                  ))}
          </div>
          {editing && (
            <label className="block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer text-xs w-fit">
              Upload Gallery Images
              <input type="file" accept="image/*" multiple hidden onChange={handleGalleryChange} />
            </label>
          )}
        </div>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSave} encType="multipart/form-data">
        <div>
          <label className="block text-gray-400 mb-1">Name</label>
          <input
            className="w-full p-2 rounded bg-gray-700 text-white"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Category</label>
          <input
            className="w-full p-2 rounded bg-gray-700 text-white"
            name="category"
            value={form.category}
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Email</label>
          <input
            className="w-full p-2 rounded bg-gray-700 text-white"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Phone</label>
          <input
            className="w-full p-2 rounded bg-gray-700 text-white"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Address</label>
          <input
            className="w-full p-2 rounded bg-gray-700 text-white"
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Description</label>
          {editing ? (
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white min-h-[80px]"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              placeholder="Describe your services, experience, etc."
            />
          ) : (
            <div className="bg-gray-700 text-white rounded p-2 min-h-[80px]">{form.description || <span className="text-gray-400">No description provided.</span>}</div>
          )}
        </div>
        {editing ? (
          <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">Save</button>
            <button type="button" className="bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <button type="button" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-4" onClick={() => setEditing(true)}>Edit Profile</button>
        )}
      </form>
    </div>
  );
};

export default Profile;
