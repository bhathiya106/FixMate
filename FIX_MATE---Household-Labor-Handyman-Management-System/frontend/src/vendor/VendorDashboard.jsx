import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";

const VendorDashboard = () => {
  const { vendorData, loading, isVendorLoggedin } = useContext(VendorContext) || {};

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Loading...</div>
          <div className="text-gray-400">Checking authentication status</div>
        </div>
      </div>
    );
  }

  if (!isVendorLoggedin || !vendorData) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4 text-red-400">Authentication Required</div>
          <div className="text-gray-400 mb-4">Please log in to access the vendor dashboard</div>
          <a href="/vendorlogin" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-end h-20 px-8 bg-gray-800 border-b border-gray-700 gap-4">
          <span className="text-lg font-semibold">
            Hey{vendorData && vendorData.name ? `, ${vendorData.name}` : ''}
          </span>
          <div className="rounded-full bg-black text-white w-14 h-14 flex items-center justify-center font-bold text-2xl">
            {vendorData && vendorData.name && vendorData.name[0]
              ? vendorData.name[0].toUpperCase()
              : "V"}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {vendorData?.isBanned && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded">
              Your account is banned. You cannot provide services until an admin unbans you.
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
