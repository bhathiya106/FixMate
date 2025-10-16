import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { DeliveryContext } from "../Context/DeliveryContext";

const DeliveryDashboard = () => {
  const { deliveryData, loading, isDeliveryLoggedin } = useContext(DeliveryContext) || {};

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

  if (!isDeliveryLoggedin || !deliveryData) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4 text-red-400">Authentication Required</div>
          <div className="text-gray-400 mb-4">Please log in to access the delivery dashboard</div>
          <a href="/deliverylogin" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
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
            Hey{deliveryData && deliveryData.name ? `, ${deliveryData.name}` : ''}
          </span>
          <div className="rounded-full bg-green-600 text-white w-14 h-14 flex items-center justify-center font-bold text-2xl">
            {deliveryData && deliveryData.name && deliveryData.name[0]
              ? deliveryData.name[0].toUpperCase()
              : "D"}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {deliveryData?.isBanned && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded">
              Your account is banned. You cannot accept or deliver orders until an admin unbans you.
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;