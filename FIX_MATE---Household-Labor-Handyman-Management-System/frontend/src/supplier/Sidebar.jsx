
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SupplierContext from "../Context/SupplierContextDefs";

const navLinks = [
  { name: "Available Orders", path: "/supplier/orders" },
  { name: "Waiting Orders", path: "/supplier/waiting" },
  { name: "Previous Orders", path: "/supplier/previous" },
  { name: "Admin Notices", path: "/supplier/notices" },
  { name: "Reviews", path: "/supplier/reviews" },
  { name: "Revenue", path: "/supplier/revenue" },
  { name: "Available Products", path: "/supplier/availableProducts" },
  { name: "Add Products", path: "/supplier/addProducts" },
  { name: "Profile", path: "/supplier/profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsSupplierLoggedin, setSupplierData, backendUrl } = useContext(SupplierContext);

  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + '/api/supplier/logout', {}, { withCredentials: true });
      setIsSupplierLoggedin(false);
      setSupplierData(null);
      navigate('/supplierlogin');
    } catch {
     
      navigate('/supplierlogin');
    }
  };

  return (
    <aside className="w-56 bg-gray-800 flex flex-col items-center py-8 min-h-screen">
      <div className="text-2xl font-bold mb-10 tracking-wider">FIX MATE<br/><p className="text-sm">Supplier Dashboard</p></div>
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
