import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DeliveryContext } from "../Context/DeliveryContext";

const navLinks = [
  { name: "Available Orders", path: "/delivery/orders" },
  { name: "Ongoing Orders", path: "/delivery/ongoing" },
  { name: "Previous Orders", path: "/delivery/previous" },
  { name: "Admin Notices", path: "/delivery/notices" },
  { name: "Revenue", path: "/delivery/revenue" },
  { name: "Profile", path: "/delivery/profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(DeliveryContext);

  const handleLogout = async () => {
    await logout();
    navigate('/deliverylogin');
  };

  return (
    <aside className="w-56 bg-gray-800 flex flex-col items-center py-8 min-h-screen">
      <div className="text-2xl font-bold mb-10 tracking-wider text-green-400">
        FIX MATE<br/>
        <p className="text-sm text-gray-300">Delivery Dashboard</p>
      </div>
      <nav className="w-full flex-1">
        <ul className="flex flex-col gap-2 w-full">
          {navLinks.map(link => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`block px-8 py-3 rounded-lg transition-colors duration-150 w-full text-left ${
                  location.pathname === link.path 
                    ? 'bg-green-600 text-white font-semibold' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
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