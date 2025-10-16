import React, { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import SupplierContext from "../Context/SupplierContextDefs";
import { toast } from 'react-toastify';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const { supplierData, loading, isSupplierLoggedin } = useContext(SupplierContext);

  useEffect(() => {
    if (!loading && !isSupplierLoggedin) {
      toast.error('Please login to access supplier dashboard');
      navigate('/supplierlogin');
    }
  }, [loading, isSupplierLoggedin, navigate]);
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
       
        <div className="flex items-center justify-end h-20 px-8 bg-gray-800 border-b border-gray-700 gap-4">
          <span className="text-lg font-semibold">
            Hey{supplierData && supplierData.name ? `, ${supplierData.name}` : ''}
          </span>
          <div className="rounded-full bg-black text-white w-14 h-14 flex items-center justify-center font-bold text-2xl">
            {supplierData && supplierData.name && supplierData.name[0] ? supplierData.name[0].toUpperCase() : "S"}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {supplierData?.isBanned && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded">
              Your account is banned. You cannot provide services or list products until an admin unbans you.
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;

