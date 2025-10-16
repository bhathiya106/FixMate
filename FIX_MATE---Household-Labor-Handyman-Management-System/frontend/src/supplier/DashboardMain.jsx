import React from "react";
import AvailableOrders from "./AvailableOrders";

const DashboardMain = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Supplier Dashboard</h1>
      <AvailableOrders />
    </div>
  );
};

export default DashboardMain;
