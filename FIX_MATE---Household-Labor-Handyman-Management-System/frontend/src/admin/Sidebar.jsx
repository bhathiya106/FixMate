import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Vendors', path: '/admin/vendors' },
  { name: 'Suppliers', path: '/admin/suppliers' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Delivery Drivers', path: '/admin/delivery-drivers' },
  { name: 'Services', path: '/admin/services' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-8 min-h-screen">
      <div className="text-2xl font-bold mb-10 tracking-wider text-white">FIX MATE</div>
      <nav className="w-full">
        <ul className="flex flex-col gap-2 w-full">
          {navLinks.map(link => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`block px-8 py-3 rounded-lg transition-colors duration-150 w-full text-left ${location.pathname === link.path ? 'bg-gray-800 text-white font-semibold border border-gray-700' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
