
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { VendorContext } from "../Context/VendorContext";

const navLinks = [
  { name: "Available Orders", path: "/vendor/orders" },
  { name: "Ongoing Orders", path: "/vendor/ongoing" },
  { name: "Previous Orders", path: "/vendor/previous" },
  { name: "Admin Notices", path: "/vendor/notices" },
  { name: "Reviews", path: "/vendor/reviews" },
  { name: "Revenue", path: "/vendor/revenue" },
  { name: "Profile", path: "/vendor/profile" }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsVendorLoggedin, setVendorData, backendUrl } = useContext(VendorContext) || {};

  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + '/api/vendor/logout', {}, { withCredentials: true });
      if (setIsVendorLoggedin) setIsVendorLoggedin(false);
      if (setVendorData) setVendorData(null);
      navigate('/vendorlogin');
    } catch {
      navigate('/vendorlogin');
    }
  };

  return (
    <aside className="w-56 bg-gray-800 flex flex-col items-center py-8 min-h-screen">
      <div className="text-2xl font-bold mb-10 tracking-wider">FIX MATE<br/><p className="text-sm">Vendor Dashboard</p></div>
      <nav className="w-full flex-1">
        <ul className="flex flex-col gap-2 w-full">
          {navLinks.map(link => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`block px-8 py-3 rounded-lg transition-colors duration-150 w-full text-left ${location.pathname === link.path ? 'bg-gray-900 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto mb-2 w-5/6 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
